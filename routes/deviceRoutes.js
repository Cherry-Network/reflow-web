const express = require('express');
const router = express.Router();
const Device = require('../models/device');
const Project = require('../models/project');

// Add a device to a project
router.post('/projects/:projectId/devices', async (req, res) => {
    try {
        const device = new Device({
            ...req.body,
            project: req.params.projectId
        });
        await device.save();

        // Add device to the project's devices array
        const project = await Project.findById(req.params.projectId);
        project.devices.push(device._id);
        await project.save();

        res.status(201).send(device);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all devices for a project
router.get('/projects/:projectId/devices', async (req, res) => {
    try {
        const devices = await Device.find({ project: req.params.projectId });
        res.status(200).send(devices);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;
