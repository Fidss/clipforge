const supabase = require('../database/supabase');
const logger = require('../utils/logger');
const orchestrator = require('../jobs/orchestrator');

async function createProject(req, res) {
    try {
        const { title, source_url } = req.body;
        if (!source_url) {
            return res.status(400).json({ success: false, error: { message: 'source_url is required' } });
        }

        const { data, error } = await supabase
            .from('projects')
            .insert([{
                title: title || 'New Project',
                source_url,
                status: 'pending'
            }])
            .select()
            .single();

        if (error) throw error;
        res.json({ success: true, data });
    } catch (err) {
        logger.error('Error creating project:', err);
        res.status(500).json({ success: false, error: { message: err.message } });
    }
}

async function listProjects(req, res) {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json({ success: true, data });
    } catch (err) {
        logger.error('Error listing projects:', err);
        res.status(500).json({ success: false, error: { message: err.message } });
    }
}

async function getProject(req, res) {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*, videos(*)')
            .eq('id', req.params.id)
            .single();

        if (error) throw error;
        res.json({ success: true, data });
    } catch (err) {
        logger.error('Error getting project:', err);
        res.status(500).json({ success: false, error: { message: err.message } });
    }
}

async function processProject(req, res) {
    try {
        const { id } = req.params;
        
        // 1. Verify project
        const { data: project, error: projError } = await supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .single();
            
        if (projError || !project) {
            return res.status(404).json({ success: false, error: { message: 'Project not found' } });
        }

        // 2. Create a source processing job
        const { data: job, error: jobError } = await supabase
            .from('processing_jobs')
            .insert([{
                project_id: id,
                type: 'source',
                status: 'queued',
                stage: 'INITIALIZING',
                message: 'Job queued...',
                started_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (jobError) throw jobError;
        
        // Update project status
        await supabase.from('projects').update({ status: 'processing' }).eq('id', id);

        orchestrator.startPipeline(job.id, project);

        res.json({ success: true, data: { jobId: job.id } });
    } catch (err) {
        logger.error('Error processing project:', err);
        res.status(500).json({ success: false, error: { message: err.message } });
    }
}

async function getTranscript(req, res) {
    try {
        // Validate project
        const { data: project, error: projError } = await supabase
            .from('projects')
            .select('id')
            .eq('id', req.params.id)
            .single();

        if (projError || !project) {
            return res.status(404).json({ success: false, error: { message: 'Project not found' } });
        }

        const { data, error } = await supabase
            .from('transcript_segments')
            .select('*, transcript_words(*)')
            .eq('project_id', req.params.id)
            .order('segment_index', { ascending: true });

        if (error) throw error;
        res.json({ success: true, data });
    } catch (err) {
        logger.error('Error getting transcript:', err);
        res.status(500).json({ success: false, error: { message: err.message } });
    }
}

module.exports = {
    createProject,
    listProjects,
    getProject,
    processProject,
    getTranscript
};
