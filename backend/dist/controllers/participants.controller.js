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
exports.ParticipantsController = void 0;
const pool_1 = require("../db/pool");
class ParticipantsController {
    static getParticipant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield pool_1.pool.query('SELECT id, name, email, phone, bio, avatar_url FROM participants WHERE user_id = $1', [id]);
                if (result.rows.length === 0) {
                    return res.status(404).json({
                        error: 'Participant not found',
                        details: 'No participant found with the provided ID'
                    });
                }
                res.json(result.rows[0]);
            }
            catch (error) {
                console.error('Error getting participant:', error);
                res.status(500).json({
                    error: 'Failed to get participant',
                    details: error.message
                });
            }
        });
    }
    static updateParticipant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield pool_1.pool.connect();
            try {
                const { id } = req.params;
                const { name, email, phone, bio, avatar_url } = req.body;
                // Start transaction
                yield client.query('BEGIN');
                // Update participant
                const result = yield client.query(`UPDATE participants 
         SET name = COALESCE($1, name),
             email = COALESCE($2, email),
             phone = COALESCE($3, phone),
             bio = COALESCE($4, bio),
             avatar_url = COALESCE($5, avatar_url)
         WHERE user_id = $6
         RETURNING id, name, email, phone, bio, avatar_url`, [name, email, phone, bio, avatar_url, id]);
                if (result.rows.length === 0) {
                    yield client.query('ROLLBACK');
                    return res.status(404).json({
                        error: 'Participant not found',
                        details: 'No participant found with the provided ID'
                    });
                }
                // If email is updated, update it in users table too
                if (email) {
                    yield client.query('UPDATE users SET email = $1 WHERE id = $2', [email, id]);
                }
                // Commit transaction
                yield client.query('COMMIT');
                res.json({
                    message: 'Profile updated successfully',
                    participant: result.rows[0]
                });
            }
            catch (error) {
                yield client.query('ROLLBACK');
                console.error('Error updating participant:', error);
                if (error.code === '23505') { // unique violation
                    return res.status(400).json({
                        error: 'Email already exists',
                        details: 'A participant with this email already exists'
                    });
                }
                res.status(500).json({
                    error: 'Failed to update participant',
                    details: error.message
                });
            }
            finally {
                client.release();
            }
        });
    }
}
exports.ParticipantsController = ParticipantsController;
