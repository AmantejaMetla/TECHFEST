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
const pool_1 = require("../db/pool");
const router = (0, express_1.Router)();
/**
 * @swagger
 * components:
 *   schemas:
 *     Sponsor:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Sponsor ID
 *         name:
 *           type: string
 *           description: Sponsor name
 *         logo_url:
 *           type: string
 *           description: URL to sponsor's logo
 *         website_url:
 *           type: string
 *           description: Sponsor's website URL
 *         sponsorship_level:
 *           type: string
 *           enum: [platinum, gold, silver, bronze]
 *           description: Level of sponsorship
 *         created_at:
 *           type: string
 *           format: date-time
 *       required:
 *         - name
 *         - sponsorship_level
 */
/**
 * @swagger
 * /api/sponsors:
 *   get:
 *     summary: Get all sponsors
 *     tags: [Sponsors]
 *     responses:
 *       200:
 *         description: List of sponsors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sponsor'
 *       500:
 *         description: Failed to fetch sponsors
 */
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield pool_1.pool.query('SELECT * FROM sponsors ORDER BY sponsorship_level, name');
        res.json(result.rows);
    }
    catch (error) {
        console.error('Error fetching sponsors:', error);
        res.status(500).json({ error: 'Failed to fetch sponsors' });
    }
}));
/**
 * @swagger
 * /api/sponsors/{id}:
 *   get:
 *     summary: Get a sponsor by ID
 *     tags: [Sponsors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Sponsor ID
 *     responses:
 *       200:
 *         description: Sponsor details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sponsor'
 *       404:
 *         description: Sponsor not found
 *       500:
 *         description: Failed to fetch sponsor
 */
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield pool_1.pool.query('SELECT * FROM sponsors WHERE id = $1', [parseInt(id)]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Sponsor not found' });
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('Error fetching sponsor:', error);
        res.status(500).json({ error: 'Failed to fetch sponsor' });
    }
}));
/**
 * @swagger
 * /api/sponsors/{id}/events:
 *   get:
 *     summary: Get all events sponsored by a sponsor
 *     tags: [Sponsors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Sponsor ID
 *     responses:
 *       200:
 *         description: List of sponsored events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       404:
 *         description: Sponsor not found
 *       500:
 *         description: Failed to fetch sponsored events
 */
router.get('/:id/events', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // First check if sponsor exists
        const sponsorExists = yield pool_1.pool.query('SELECT id FROM sponsors WHERE id = $1', [parseInt(id)]);
        if (sponsorExists.rows.length === 0) {
            return res.status(404).json({ error: 'Sponsor not found' });
        }
        const result = yield pool_1.pool.query(`
      SELECT e.* 
      FROM events e
      JOIN event_sponsors es ON e.id = es.event_id
      WHERE es.sponsor_id = $1
      ORDER BY e.start_date
    `, [parseInt(id)]);
        res.json(result.rows);
    }
    catch (error) {
        console.error('Error fetching sponsored events:', error);
        res.status(500).json({ error: 'Failed to fetch sponsored events' });
    }
}));
exports.default = router;
