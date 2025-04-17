const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth, isAdmin } = require('../middleware/auth');

// Get all judges (public)
router.get('/', async (req, res) => {
    try {
        const judges = await User.find({ role: 'judge' })
            .select('-password')
            .sort('username');
        res.json(judges);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching judges', error: error.message });
    }
});

// Get judge by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const judge = await User.findOne({ _id: req.params.id, role: 'judge' })
            .select('-password');
        if (!judge) {
            return res.status(404).json({ message: 'Judge not found' });
        }
        res.json(judge);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching judge', error: error.message });
    }
});

// Create new judge (admin only)
router.post('/', [auth, isAdmin], async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const judge = new User({
            username,
            email,
            password,
            role: 'judge'
        });

        await judge.save();
        
        const judgeResponse = judge.toObject();
        delete judgeResponse.password;
        
        res.status(201).json(judgeResponse);
    } catch (error) {
        res.status(500).json({ message: 'Error creating judge', error: error.message });
    }
});

// Update judge (admin only)
router.put('/:id', [auth, isAdmin], async (req, res) => {
    try {
        const { username, email } = req.body;
        const judge = await User.findOne({ _id: req.params.id, role: 'judge' });

        if (!judge) {
            return res.status(404).json({ message: 'Judge not found' });
        }

        if (username) judge.username = username;
        if (email) judge.email = email;

        await judge.save();
        
        const judgeResponse = judge.toObject();
        delete judgeResponse.password;
        
        res.json(judgeResponse);
    } catch (error) {
        res.status(500).json({ message: 'Error updating judge', error: error.message });
    }
});

// Delete judge (admin only)
router.delete('/:id', [auth, isAdmin], async (req, res) => {
    try {
        const judge = await User.findOne({ _id: req.params.id, role: 'judge' });
        if (!judge) {
            return res.status(404).json({ message: 'Judge not found' });
        }

        await judge.remove();
        res.json({ message: 'Judge deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting judge', error: error.message });
    }
});

module.exports = router; 