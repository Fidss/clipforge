const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth.middleware');
const projectController = require('../controllers/project.controller');
const clipController = require('../controllers/clip.controller');

// Projects
router.post('/projects', requireAuth, projectController.createProject);
router.get('/projects', requireAuth, projectController.listProjects);
router.get('/projects/:id', requireAuth, projectController.getProject);
router.post('/projects/:id/process', requireAuth, projectController.processProject);

// Transcripts
router.get('/projects/:id/transcript', requireAuth, projectController.getTranscript);

// Clips
router.get('/projects/:id/clips', requireAuth, clipController.listClips);
router.post('/clips/:id/render', requireAuth, clipController.renderClip);
router.get('/clips/:id', requireAuth, clipController.getClip);
router.delete('/clips/:id', requireAuth, clipController.deleteClip);

module.exports = router;
