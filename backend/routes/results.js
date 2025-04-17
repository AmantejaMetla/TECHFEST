const express = require('express');
const router = express.Router();
const Result = require('../models/Result');
const { auth, isJudge } = require('../middleware/auth');

// Get all results (public)
router.get('/', async (req, res) => {
    try {
        const results = await Result.find()
            .populate('participant', 'username')
            .populate('scores.judge', 'username')
            .sort('-createdAt');
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching results', error: error.message });
    }
});

// Get result by ID
router.get('/:id', async (req, res) => {
    try {
        const result = await Result.findById(req.params.id)
            .populate('participant', 'username')
            .populate('scores.judge', 'username');
        if (!result) {
            return res.status(404).json({ message: 'Result not found' });
        }
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching result', error: error.message });
    }
});

// Create new result (judges only)
router.post('/', [auth, isJudge], async (req, res) => {
    try {
        const { event, participant, scores } = req.body;
        
        const result = new Result({
            event,
            participant,
            scores: [{
                judge: req.user.userId,
                ...scores
            }]
        });

        await result.save();
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error creating result', error: error.message });
    }
});

// Update result (judges only)
router.put('/:id', [auth, isJudge], async (req, res) => {
    try {
        const { scores } = req.body;
        const result = await Result.findById(req.params.id);

        if (!result) {
            return res.status(404).json({ message: 'Result not found' });
        }

        // Add new score
        result.scores.push({
            judge: req.user.userId,
            ...scores
        });

        await result.save();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error updating result', error: error.message });
    }
});

// Delete result (judges only)
router.delete('/:id', [auth, isJudge], async (req, res) => {
    try {
        const result = await Result.findById(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'Result not found' });
        }

        await result.remove();
        res.json({ message: 'Result deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting result', error: error.message });
    }
});

// Get results by event
router.get('/event/:eventName', async (req, res) => {
    try {
        const results = await Result.find({ event: req.params.eventName })
            .populate('participant', 'username')
            .populate('scores.judge', 'username')
            .sort('-totalScore');
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching results', error: error.message });
    }
});

module.exports = router; 