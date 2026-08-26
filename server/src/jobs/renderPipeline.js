const fs = require('fs');
const path = require('path');
const supabase = require('../database/supabase');
const logger = require('../utils/logger');
const { enqueueJob, updateJobProgress } = require('./processor');
const { renderClip } = require('../services/video/ffmpeg.service');
const { downloadVideo } = require('../services/source/download.service');

function formatAssTime(seconds) {
    const d = new Date(seconds * 1000);
    const h = d.getUTCHours();
    const m = String(d.getUTCMinutes()).padStart(2, '0');
    const s = String(d.getUTCSeconds()).padStart(2, '0');
    const cs = String(Math.floor(d.getUTCMilliseconds() / 10)).padStart(2, '0');
    return `${h}:${m}:${s}.${cs}`;
}

async function processRender(jobId, clipId, subtitleStyle) {
    let videoPath = null;
    let outputPath = null;
    let projectId = null;
    try {
        const { data: clip, error: clipError } = await supabase.from('clips').select('*, projects(*)').eq('id', clipId).single();
        if (clipError) throw clipError;
        
        projectId = clip.project_id;

        await updateJobProgress(jobId, projectId, 10, 'DOWNLOADING_SOURCE', 'Downloading source video...');

        videoPath = await downloadVideo(clip.projects.source_url, clipId);

        await updateJobProgress(jobId, projectId, 50, 'RENDERING_CLIP', 'Rendering clip...');

        // Ensure the clips directory exists
        const clipsDir = path.join(__dirname, '../../../storage/clips');
        if (!fs.existsSync(clipsDir)) {
            fs.mkdirSync(clipsDir, { recursive: true });
        }

        // --- Generate ASS Subtitles ---
        let assPath = null;
        if (subtitleStyle !== 'none') {
            const { data: words, error: wordsError } = await supabase
                .from('transcript_words')
                .select('*')
                .eq('project_id', projectId)
                .gte('end_time', clip.start_time)
                .lte('start_time', clip.end_time)
                .order('start_time', { ascending: true });
                
            if (wordsError) logger.error('Failed to fetch words for ASS:', wordsError);

            let assContent = `[Script Info]\nScriptType: v4.00+\nPlayResX: 1080\nPlayResY: 1920\n\n[V4+ Styles]\nFormat: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\n`;

            if (subtitleStyle === 'classic') {
                assContent += `Style: Default,Arial,80,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,4,0,2,20,20,200,1\n`;
            } else if (subtitleStyle === 'hormozi') {
                assContent += `Style: Default,Montserrat Black,110,&H0000FFFF,&H000000FF,&H00000000,&H00000000,1,0,0,0,100,100,0,0,1,8,0,2,20,20,200,1\n`;
            } else if (subtitleStyle === 'neon') {
                assContent += `Style: Default,Comic Sans MS,95,&H0000FF00,&H000000FF,&H00000000,&H00000000,1,0,0,0,100,100,0,0,1,4,0,2,20,20,200,1\n`;
            } else {
                assContent += `Style: Default,Arial,80,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,4,0,2,20,20,200,1\n`;
            }

            assContent += `\n[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n`;

            if (words && words.length > 0) {
                let currentChunk = [];
                let chunks = [];
                
                for (let i = 0; i < words.length; i++) {
                    const word = words[i];
                    let wStart = word.start_time - clip.start_time;
                    let wEnd = word.end_time - clip.start_time;
                    if (wStart >= clip.duration || wEnd <= 0) continue;
                    
                    wStart = Math.max(0, wStart);
                    wEnd = Math.min(clip.duration, wEnd);

                    currentChunk.push({ text: word.word, start: wStart, end: wEnd });
                    
                    const charCount = currentChunk.map(w => w.text).join('').length;
                    
                    // Chunk at 3 words or 15 chars, or end of sentence
                    if (currentChunk.length >= 3 || charCount > 15 || /[.?!]$/.test(word.word.trim()) || i === words.length - 1) {
                        chunks.push({
                            start: currentChunk[0].start,
                            end: currentChunk[currentChunk.length - 1].end,
                            text: currentChunk.map(w => w.text).join('').trim()
                        });
                        currentChunk = [];
                    }
                }

                for (const chunk of chunks) {
                    assContent += `Dialogue: 0,${formatAssTime(chunk.start)},${formatAssTime(chunk.end)},Default,,0,0,0,,${chunk.text}\n`;
                }
            }
            
            assPath = path.join(clipsDir, `${clipId}.ass`);
            fs.writeFileSync(assPath, assContent);
        }
        // -----------------------------

        outputPath = path.join(clipsDir, `${clipId}.mp4`);

        await renderClip({
            inputPath: videoPath,
            outputPath,
            startTime: clip.start_time,
            duration: clip.duration,
            aspectRatio: clip.aspect_ratio,
            subtitlePath: assPath,
            onProgress: async (percent) => {
                await updateJobProgress(jobId, projectId, percent, 'RENDERING_CLIP', `Rendering clip... ${percent}%`);
            }
        });
        
        const outputUrl = `${process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/:5173$/, ':3001') : 'http://localhost:3001'}/storage/clips/${clipId}.mp4`;

        await supabase.from('clips').update({
            status: 'completed',
            output_path: outputPath,
            output_url: outputUrl
        }).eq('id', clipId);

        await updateJobProgress(jobId, projectId, 100, 'COMPLETED', 'Render finished successfully.', 'completed');

    } catch (error) {
        logger.error(`Render Job ${jobId} failed:`, error);
        await supabase.from('clips').update({ status: 'failed' }).eq('id', clipId);
        if (projectId) {
            await updateJobProgress(jobId, projectId, 0, 'FAILED', 'An error occurred during rendering.', 'failed', error.message);
        } else {
            // fallback if clip was not fetched
            await supabase.from('processing_jobs').update({ stage: 'FAILED', progress: 0, status: 'failed', error_message: error.message, completed_at: new Date().toISOString() }).eq('id', jobId);
        }
    } finally {
        if (videoPath && fs.existsSync(videoPath)) {
            fs.unlink(videoPath, err => {
                if (err) logger.error(`Failed to delete temp video ${videoPath}:`, err);
            });
        }
    }
}

function startRenderPipeline(jobId, clipId, subtitleStyle = 'none') {
    enqueueJob(() => processRender(jobId, clipId, subtitleStyle));
}

module.exports = { startRenderPipeline };
