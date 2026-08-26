const fs = require('fs');
const supabase = require('../database/supabase');
const logger = require('../utils/logger');
const { updateJobProgress, enqueueJob } = require('./processor');
const { getVideoInfo, downloadAudio } = require('../services/source/download.service');
const { transcribeAudio } = require('../services/transcription/fasterWhisper.service');
const { analyzeTranscript } = require('../services/ai/gemini.service');

async function processPipeline(jobId, projectId, sourceUrl) {
    let audioPath = null;
    try {
        // --- 1. SOURCE STAGE ---
        await updateJobProgress(jobId, projectId, 10, 'SOURCE', 'Fetching video info...');
        const videoInfo = await getVideoInfo(sourceUrl);
        
        await supabase.from('videos').insert([{
            project_id: projectId,
            source_url: sourceUrl,
            title: videoInfo.title,
            description: videoInfo.description,
            channel_name: videoInfo.channel_name,
            duration: videoInfo.duration,
            width: videoInfo.width,
            height: videoInfo.height,
            thumbnail_url: videoInfo.thumbnail_url,
            source_status: 'downloaded'
        }]);
        
        await supabase.from('projects').update({
            title: videoInfo.title,
            duration: videoInfo.duration,
            thumbnail_url: videoInfo.thumbnail_url
        }).eq('id', projectId);

        await updateJobProgress(jobId, projectId, 20, 'SOURCE', 'Downloading audio...');
        audioPath = await downloadAudio(sourceUrl, projectId);

        // --- 2. TRANSCRIPTION STAGE ---
        await updateJobProgress(jobId, projectId, 40, 'TRANSCRIPTION', 'Transcribing audio with AI (this may take a while)...');
        const segments = await transcribeAudio(audioPath);

        await updateJobProgress(jobId, projectId, 60, 'TRANSCRIPTION', 'Saving transcript to database...');
        
        // Save to DB
        let segmentIndex = 0;
        for (const segment of segments) {
            const { data: insertedSegment, error: segError } = await supabase
                .from('transcript_segments')
                .insert([{
                    project_id: projectId,
                    start_time: segment.start,
                    end_time: segment.end,
                    text: segment.text,
                    segment_index: segmentIndex++
                }])
                .select()
                .single();
                
            if (segError) throw segError;

            if (segment.words && segment.words.length > 0) {
                const wordsToInsert = segment.words.map((w, i) => ({
                    project_id: projectId,
                    segment_id: insertedSegment.id,
                    word: w.word,
                    start_time: w.start,
                    end_time: w.end,
                    word_index: i
                }));
                await supabase.from('transcript_words').insert(wordsToInsert);
            }
        }

        // Fetch saved segments for AI analysis
        const { data: savedSegments } = await supabase
            .from('transcript_segments')
            .select('*')
            .eq('project_id', projectId)
            .order('start_time', { ascending: true });

        // --- 3. AI ANALYSIS STAGE ---
        await updateJobProgress(jobId, projectId, 75, 'AI_ANALYSIS', 'Analyzing transcript with Gemini to find clips...');
        const clips = await analyzeTranscript(savedSegments);

        await updateJobProgress(jobId, projectId, 90, 'AI_ANALYSIS', 'Saving candidate clips...');
        const clipsToInsert = clips.map(clip => ({
            project_id: projectId,
            title: clip.title,
            start_time: clip.start,
            end_time: clip.end,
            duration: clip.end - clip.start,
            score: clip.score,
            reason: clip.reason,
            hook: clip.hook,
            status: 'candidate'
        }));
        
        await supabase.from('clips').insert(clipsToInsert);

        // --- 4. COMPLETED ---
        await supabase.from('projects').update({ status: 'completed' }).eq('id', projectId);
        await updateJobProgress(jobId, projectId, 100, 'COMPLETED', 'Processing finished successfully.', 'completed');
        
    } catch (error) {
        logger.error(`Job ${jobId} failed:`, error);
        await supabase.from('projects').update({ status: 'failed' }).eq('id', projectId);
        await updateJobProgress(jobId, projectId, 0, 'FAILED', 'An error occurred during processing.', 'failed', error.message);
    } finally {
        if (audioPath && fs.existsSync(audioPath)) {
            fs.unlink(audioPath, err => {
                if (err) logger.error(`Failed to delete temp audio file ${audioPath}:`, err);
            });
        }
    }
}

function startPipeline(jobId, project) {
    enqueueJob(() => processPipeline(jobId, project.id, project.source_url));
}

module.exports = { startPipeline };
