"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultsController = void 0;
const pool_1 = require("../db/pool");
class ResultsController {
    // Submit a result
    static submitResult(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { eventId, participantId } = req.params;
                const { score, position, notes } = req.body;
                if (!eventId || !participantId) {
                    return res.status(400).json({ error: 'Event ID and Participant ID are required' });
                }
                const eventIdInt = parseInt(eventId);
                const participantIdInt = parseInt(participantId);
                if (isNaN(eventIdInt) || isNaN(participantIdInt)) {
                    return res.status(400).json({ error: 'Invalid ID format' });
                }
                const result = yield pool_1.pool.query('INSERT INTO results (event_id, participant_id, score, position, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *', [eventIdInt, participantIdInt, score, position, notes]);
                res.status(201).json(result.rows[0]);
            }
            catch (error) {
                console.error('Error in submitResult:', error);
                const message = error instanceof Error ? error.message : 'An unknown error occurred';
                res.status(500).json({
                    error: 'Failed to submit result',
                    details: message
                });
            }
        });
    }
    // Get all results for an event
    static getEventResults(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { eventId } = req.params;
                if (!eventId) {
                    return res.status(400).json({ error: 'Event ID is required' });
                }
                const eventIdInt = parseInt(eventId);
                if (isNaN(eventIdInt)) {
                    return res.status(400).json({ error: 'Invalid Event ID format' });
                }
                const result = yield pool_1.pool.query(`SELECT 
          event_id,
          participant_id,
          position,
          score,
          notes,
          created_at
        FROM results 
        WHERE event_id = $1 
        ORDER BY position ASC`, [eventIdInt]);
                res.json(result.rows);
            }
            catch (error) {
                console.error('Error in getEventResults:', error);
                const message = error instanceof Error ? error.message : 'An unknown error occurred';
                res.status(500).json({
                    error: 'Failed to fetch event results',
                    details: message
                });
            }
        });
    }
    // Get results for a specific participant
    static getParticipantResults(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { eventId, participantId } = req.params;
                // Log the incoming request parameters
                console.log('Request params:', { eventId, participantId });
                // Validate parameters
                if (!eventId || !participantId) {
                    console.log('Missing required parameters');
                    return res.status(400).json({ error: 'Event ID and Participant ID are required' });
                }
                // Convert to integers and validate
                const eventIdInt = parseInt(eventId);
                const participantIdInt = parseInt(participantId);
                if (isNaN(eventIdInt) || isNaN(participantIdInt)) {
                    console.log('Invalid ID format');
                    return res.status(400).json({ error: 'Invalid ID format' });
                }
                // Log the query we're about to execute
                console.log('Executing query with params:', { eventIdInt, participantIdInt });
                const result = yield pool_1.pool.query(`SELECT 
          event_id,
          participant_id,
          position,
          score,
          notes,
          created_at
        FROM results 
        WHERE event_id = $1 AND participant_id = $2`, [eventIdInt, participantIdInt]);
                // Log the query results
                console.log('Query results:', result.rows);
                if (result.rows.length === 0) {
                    console.log('No results found');
                    return res.status(404).json({
                        error: 'Results not found',
                        params: { eventId: eventIdInt, participantId: participantIdInt }
                    });
                }
                res.json(result.rows[0]);
            }
            catch (error) {
                // Log the full error
                console.error('Error in getParticipantResults:', error);
                // Check if it's a database connection error
                if (error instanceof Error) {
                    const dbError = error;
                    if (dbError.code === 'ECONNREFUSED') {
                        return res.status(500).json({
                            error: 'Database connection failed',
                            details: 'Could not connect to the database'
                        });
                    }
                    res.status(500).json({
                        error: 'Failed to fetch participant results',
                        details: dbError.message
                    });
                }
                else {
                    res.status(500).json({
                        error: 'Failed to fetch participant results',
                        details: 'An unknown error occurred'
                    });
                }
            }
        });
    }
}
exports.ResultsController = ResultsController;
