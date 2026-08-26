const logger = require('../utils/logger');
const supabase = require('../database/supabase');

let ioInstance = null;

function setupSocket(io) {
    ioInstance = io;
    io.on('connection', (socket) => {
        logger.info(`Client connected: ${socket.id}`);
        socket.on('join_project', (projectId) => {
            socket.join(`project_${projectId}`);
            logger.info(`Socket ${socket.id} joined project_${projectId}`);
        });
        socket.on('disconnect', () => {
            logger.info(`Client disconnected: ${socket.id}`);
        });
    });
}

async function updateJobProgress(jobId, projectId, progress, stage, message, status = 'processing', errorMessage = null) {
    if (ioInstance) {
        const payload = { jobId, projectId, progress, stage, message, status };
        if (errorMessage) payload.error_message = errorMessage;
        
        if (status === 'completed') ioInstance.to(`project_${projectId}`).emit('job:completed', payload);
        else if (status === 'failed') ioInstance.to(`project_${projectId}`).emit('job:failed', payload);
        else ioInstance.to(`project_${projectId}`).emit('job:progress', payload);
    }

    try {
        const updateData = {
            progress,
            stage,
            message,
            status,
            updated_at: new Date().toISOString()
        };
        if (errorMessage) updateData.error_message = errorMessage;
        if (status === 'completed' || status === 'failed') {
            updateData.completed_at = new Date().toISOString();
        }

        await supabase
            .from('processing_jobs')
            .update(updateData)
            .eq('id', jobId);
    } catch (err) {
        logger.error(`Failed to update job ${jobId} in DB:`, err);
    }
}

// Simple in-memory queue
const jobQueue = [];
let isProcessingQueue = false;

async function processQueue() {
    if (isProcessingQueue || jobQueue.length === 0) return;
    isProcessingQueue = true;

    while (jobQueue.length > 0) {
        const task = jobQueue.shift();
        try {
            await task();
        } catch (error) {
            logger.error('Error processing task:', error);
        }
    }
    isProcessingQueue = false;
}

function enqueueJob(task) {
    jobQueue.push(task);
    processQueue();
}

module.exports = { setupSocket, updateJobProgress, enqueueJob };
