const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const ffprobeStatic = require('ffprobe-static');
const path = require('path');
const logger = require('../../utils/logger');

// Tell fluent-ffmpeg where the binaries are
ffmpeg.setFfmpegPath(ffmpegStatic);
ffmpeg.setFfprobePath(ffprobeStatic.path);
require('dotenv').config({ path: path.join(__dirname, '../../../../.env') });

if (process.env.FFMPEG_PATH) ffmpeg.setFfmpegPath(process.env.FFMPEG_PATH);
if (process.env.FFPROBE_PATH) ffmpeg.setFfprobePath(process.env.FFPROBE_PATH);

function renderClip({ inputPath, outputPath, startTime, duration, aspectRatio, subtitlePath, onProgress }) {
    return new Promise((resolve, reject) => {
        let command = ffmpeg(inputPath)
            .setStartTime(startTime)
            .setDuration(duration);

        const filters = [];

        if (aspectRatio === '9:16') {
            filters.push('crop=ih*9/16:ih,scale=1080:1920');
        } else if (aspectRatio === '1:1') {
            filters.push('crop=ih:ih');
        }

        if (subtitlePath) {
            const relativeSubPath = require('path').relative(process.cwd(), subtitlePath);
            const escapedSubPath = relativeSubPath.replace(/\\/g, '/');
            filters.push(`subtitles=${escapedSubPath}`);
        }

        if (filters.length > 0) {
            command.videoFilters(filters);
        }

        command
            .outputOptions('-y')
            .output(outputPath)
            .on('progress', (progress) => {
                if (onProgress && progress.percent) {
                    onProgress(Math.min(100, Math.round(progress.percent)));
                }
            })
            .on('end', () => resolve(outputPath))
            .on('error', (err) => {
                logger.error('FFmpeg render error:', err);
                reject(err);
            })
            .run();
    });
}

module.exports = { renderClip };
