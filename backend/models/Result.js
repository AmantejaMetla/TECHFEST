const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    event: {
        type: String,
        required: true
    },
    participant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    scores: [{
        judge: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        criteria: {
            technical: { type: Number, min: 0, max: 10 },
            innovation: { type: Number, min: 0, max: 10 },
            presentation: { type: Number, min: 0, max: 10 },
            implementation: { type: Number, min: 0, max: 10 }
        },
        feedback: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    totalScore: {
        type: Number,
        default: 0
    },
    rank: {
        type: Number
    },
    status: {
        type: String,
        enum: ['pending', 'evaluated', 'final'],
        default: 'pending'
    },
    round: {
        type: Number,
        default: 1
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp on save
resultSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Calculate total score before saving
resultSchema.pre('save', function(next) {
    if (this.scores && this.scores.length > 0) {
        let total = 0;
        this.scores.forEach(score => {
            const criteria = score.criteria;
            total += (criteria.technical + criteria.innovation + 
                     criteria.presentation + criteria.implementation) / 4;
        });
        this.totalScore = total / this.scores.length;
    }
    next();
});

module.exports = mongoose.model('Result', resultSchema); 