const supabase = require('../database/supabase');
const logger = require('../utils/logger');
const renderPipeline = require('../jobs/renderPipeline');

async function listClips(req, res) {
    try {
        // Validate project ownership
        const { data: project, error: projError } = await supabase
            .from('projects')
            .select('id')
            .eq('id', req.params.id)
            .single();

        if (projError || !project) {
            return res.status(404).json({ success: false, error: { message: 'Project not found' } });
        }

        const { data, error } = await supabase
            .from('clips')
            .select('*')
            .eq('project_id', req.params.id)
            .order('score', { ascending: false });

        if (error) throw error;
        res.json({ success: true, data });
    } catch (err) {
        logger.error('Error listing clips:', err);
        res.status(500).json({ success: false, error: { message: err.message } });
    }
}

async function getClip(req, res) {
    try {
        const { data: clip, error } = await supabase
            .from('clips')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error || !clip) {
            return res.status(404).json({ success: false, error: { message: 'Clip not found' } });
        }

        res.json({ success: true, data: clip });
    } catch (err) {
        logger.error('Error getting clip:', err);
        res.status(500).json({ success: false, error: { message: err.message } });
    }
}

    async function renderClip(req, res) {
        try {
            const { id } = req.params;
            const { aspect_ratio, start_time, end_time, subtitle_style } = req.body;

            const { data: clip, error: clipError } = await supabase
                .from('clips')
                .select('*')
                .eq('id', id)
                .single();

            if (clipError || !clip) {
                return res.status(404).json({ success: false, error: { message: 'Clip not found' } });
            }

            // Update clip with new settings
            const updates = { status: 'rendering' };
            if (aspect_ratio) updates.aspect_ratio = aspect_ratio;
            if (start_time !== undefined) updates.start_time = start_time;
            if (end_time !== undefined) updates.end_time = end_time;
            if (start_time !== undefined && end_time !== undefined) updates.duration = end_time - start_time;

            await supabase.from('clips').update(updates).eq('id', id);

            // Create render job
            const { data: job, error: jobError } = await supabase
                .from('processing_jobs')
                .insert([{
                    project_id: clip.project_id,
                    type: 'render',
                    status: 'queued',
                    stage: 'QUEUED',
                    message: 'Render job queued...',
                    started_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (jobError) throw jobError;

            renderPipeline.startRenderPipeline(job.id, clip.id, subtitle_style || 'none');

        res.json({ success: true, data: { jobId: job.id, clipId: id } });
    } catch (err) {
        logger.error('Error starting render:', err);
        res.status(500).json({ success: false, error: { message: err.message } });
    }
}

async function deleteClip(req, res) {
    try {
        const { id } = req.params;
        const { data: clip, error: clipError } = await supabase
            .from('clips')
            .select('id')
            .eq('id', id)
            .single();

        if (clipError || !clip) {
            return res.status(404).json({ success: false, error: { message: 'Clip not found' } });
        }

        await supabase.from('clips').delete().eq('id', id);
        res.json({ success: true });
    } catch (err) {
        logger.error('Error deleting clip:', err);
        res.status(500).json({ success: false, error: { message: err.message } });
    }
}

module.exports = {
    listClips,
    getClip,
    renderClip,
    deleteClip
};
