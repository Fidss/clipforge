const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const logger = require('../../utils/logger');
const ffmpegStatic = require('ffmpeg-static');

const TEMP_DIR = path.join(__dirname, '../../../../storage/temp');

function getVideoInfo(url) {
    return new Promise((resolve, reject) => {
        const ytdlp = spawn('python', ['-m', 'yt_dlp', '-j', url]);
        let data = '';
        let errData = '';

        ytdlp.stdout.on('data', chunk => data += chunk);
        ytdlp.stderr.on('data', chunk => errData += chunk);

        ytdlp.on('error', (err) => {
            reject(new Error(`Failed to start yt-dlp: ${err.message}. Make sure yt-dlp is installed and in your PATH.`));
        });

        ytdlp.on('close', code => {
            if (code !== 0) return reject(new Error(`yt-dlp failed: ${errData}`));
            try {
                const info = JSON.parse(data);
                resolve({
                    title: info.title,
                    description: info.description,
                    channel_name: info.uploader,
                    duration: info.duration,
                    width: info.width,
                    height: info.height,
                    thumbnail_url: info.thumbnail
                });
            } catch (e) {
                reject(e);
            }
        });
    });
}

function downloadAudio(url, projectId) {
    return new Promise((resolve, reject) => {
        const outputPath = path.join(TEMP_DIR, `${projectId}_audio.%(ext)s`);
        const finalPath = path.join(TEMP_DIR, `${projectId}_audio.wav`);
        
        const args = [
            url,
            '-f', 'bestaudio',
            '--extract-audio',
            '--audio-format', 'wav',
            '--ffmpeg-location', ffmpegStatic,
            '--no-part',
            '-o', outputPath
        ];

        const ytdlp = spawn('python', ['-m', 'yt_dlp', ...args]);
        let errData = '';
        ytdlp.stderr.on('data', chunk => errData += chunk);
        
        ytdlp.on('error', (err) => {
            reject(new Error(`Failed to start yt-dlp: ${err.message}`));
        });
        ytdlp.on('close', code => {
            if (code !== 0) return reject(new Error(`Audio download failed: ${errData}`));
            resolve(finalPath);
        });
    });
}

function downloadVideo(url, uniqueId) {
    return new Promise((resolve, reject) => {
        const finalPath = path.join(TEMP_DIR, `${uniqueId}_video.mp4`);
        const args = [
            url,
            '-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
            '--ffmpeg-location', ffmpegStatic,
            '--no-part',
            '-o', finalPath
        ];

        const ytdlp = spawn('python', ['-m', 'yt_dlp', ...args]);
        let errData = '';
        ytdlp.stderr.on('data', chunk => errData += chunk);
        
        ytdlp.on('error', (err) => {
            reject(new Error(`Failed to start yt-dlp: ${err.message}`));
        });
        ytdlp.on('close', code => {
            if (code !== 0) {
                // Workaround for Windows Defender / WinError 32 file lock during yt-dlp rename
                if (errData.includes('WinError 32') && errData.includes('.temp.mp4')) {
                    const tempPath = finalPath.replace('.mp4', '.temp.mp4');
                    if (fs.existsSync(tempPath)) {
                        logger.warn(`yt-dlp rename failed, but .temp.mp4 exists. Proceeding with temp file: ${tempPath}`);
                        // Just use the .temp.mp4 file directly since ffmpeg finished merging it
                        return resolve(tempPath);
                    }
                }
                return reject(new Error(`Video download failed: ${errData}`));
            }
            resolve(finalPath);
        });
    });
}

module.exports = { getVideoInfo, downloadAudio, downloadVideo };
