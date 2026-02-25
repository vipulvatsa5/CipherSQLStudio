const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');

// Get all assignments (list view)
router.get('/', async (req, res) => {
    try {
        const assignments = await Assignment.find().select('title difficulty description');
        res.json(assignments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single assignment details
router.get('/:id', async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id).select('-solutionQuery'); // Hide solution
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
        res.json(assignment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// CREATE - Internal use or for seeding
router.post('/', async (req, res) => {
    try {
        const newAssignment = new Assignment(req.body);
        const saved = await newAssignment.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
