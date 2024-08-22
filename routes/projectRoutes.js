const express = require('express');
const router = express.Router();
const Project = require('../models/project');

// Create a new project
router.post('/projects', async (req, res) => {
    try {
        const project = new Project(req.body);
        await project.save();
        res.status(201).send(project);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all projects
router.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find().populate('devices');
        res.status(200).send(projects);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;
