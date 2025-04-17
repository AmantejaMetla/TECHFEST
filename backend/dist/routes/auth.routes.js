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
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const pool_1 = require("../db/pool");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [participant, judge, admin]
 *                 default: participant
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input or user already exists
 */
router.post('/register', auth_controller_1.AuthController.register);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', auth_controller_1.AuthController.login);
/**
 * @swagger
 * /api/auth/cleanup/{email}:
 *   delete:
 *     summary: Delete a user by email (Development only)
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to delete user
 */
router.delete('/cleanup/:email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield pool_1.pool.connect();
    try {
        yield client.query('BEGIN');
        const { email } = req.params;
        // First get the user to check if they exist
        const userResult = yield client.query('SELECT id FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            yield client.query('ROLLBACK');
            return res.status(404).json({ error: 'User not found' });
        }
        const userId = userResult.rows[0].id;
        // Delete from participants table first (if exists)
        yield client.query('DELETE FROM participants WHERE user_id = $1', [userId]);
        // Then delete from users table
        yield client.query('DELETE FROM users WHERE id = $1', [userId]);
        yield client.query('COMMIT');
        res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        yield client.query('ROLLBACK');
        console.error('Error in cleanup:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
    finally {
        client.release();
    }
}));
exports.default = router;
