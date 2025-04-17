import { Router } from 'express';
import { pool } from '../db/pool';

const router = Router();

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
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sponsors ORDER BY sponsorship_level, name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching sponsors:', error);
    res.status(500).json({ error: 'Failed to fetch sponsors' });
  }
});

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
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM sponsors WHERE id = $1', [parseInt(id)]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sponsor not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching sponsor:', error);
    res.status(500).json({ error: 'Failed to fetch sponsor' });
  }
});

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
router.get('/:id/events', async (req, res) => {
  try {
    const { id } = req.params;
    // First check if sponsor exists
    const sponsorExists = await pool.query('SELECT id FROM sponsors WHERE id = $1', [parseInt(id)]);
    if (sponsorExists.rows.length === 0) {
      return res.status(404).json({ error: 'Sponsor not found' });
    }

    const result = await pool.query(`
      SELECT e.* 
      FROM events e
      JOIN event_sponsors es ON e.id = es.event_id
      WHERE es.sponsor_id = $1
      ORDER BY e.start_date
    `, [parseInt(id)]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching sponsored events:', error);
    res.status(500).json({ error: 'Failed to fetch sponsored events' });
  }
});

export default router; 