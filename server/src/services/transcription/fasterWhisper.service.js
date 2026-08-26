const { spawn } = require('child_process');
const path = require('path');
const logger = require('../../utils/logger');

function transcribeAudio(audioPath) {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(__dirname, 'whisper_script.py');
        const pythonProcess = spawn('python', [scriptPath, audioPath]);
        
        pythonProcess.on('error', (err) => {
            reject(new Error(`Failed to start python: ${err.message}. Make sure Python is installed and in your PATH.`));
        });

        let output = '';
        let errorOutput = '';

        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                logger.error(`Python script failed: ${errorOutput}`);
                return reject(new Error('Transcription failed: ' + errorOutput));
            }
            try {
                // Remove any non-json output before the first {
                const jsonStart = output.indexOf('{');
                if (jsonStart !== -1) {
                    output = output.slice(jsonStart);
                }
                const result = JSON.parse(output);
                if (result.error) return reject(new Error(result.error));
                resolve(result.segments);
            } catch (err) {
                logger.error('Failed to parse python output:', output);
                reject(err);
            }
        });
    });
}

module.exports = { transcribeAudio };
