import { Router } from 'express';
import { pool } from '../db/pool';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Judge:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Judge ID
 *         name:
 *           type: string
 *           description: Full name of the judge
 *         title:
 *           type: string
 *           description: Professional title or role
 *         bio:
 *           type: string
 *           description: Professional biography
 *         image_url:
 *           type: string
 *           description: URL to judge's profile image
 *         created_at:
 *           type: string
 *           format: date-time
 *       required:
 *         - name
 *         - title
 */

/**
 * @swagger
 * /api/judges:
 *   get:
 *     summary: Get all judges
 *     tags: [Judges]
 *     responses:
 *       200:
 *         description: List of judges
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Judge'
 *       500:
 *         description: Failed to fetch judges
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM judges ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching judges:', error);
    res.status(500).json({ error: 'Failed to fetch judges' });
  }
});

/**
 * @swagger
 * /api/judges/{id}:
 *   get:
 *     summary: Get a judge by ID
 *     tags: [Judges]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Judge ID
 *     responses:
 *       200:
 *         description: Judge details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Judge'
 *       404:
 *         description: Judge not found
 *       500:
 *         description: Failed to fetch judge
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM judges WHERE id = $1', [parseInt(id)]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Judge not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching judge:', error);
    res.status(500).json({ error: 'Failed to fetch judge' });
  }
});

/**
 * @swagger
 * /api/judges/{id}/events:
 *   get:
 *     summary: Get all events judged by a judge
 *     tags: [Judges]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Judge ID
 *     responses:
 *       200:
 *         description: List of events judged
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Event'
 *                   - type: object
 *                     properties:
 *                       judge_role:
 *                         type: string
 *                         description: Role of the judge in this event
 *       404:
 *         description: Judge not found
 *       500:
 *         description: Failed to fetch judged events
 */
router.get('/:id/events', async (req, res) => {
  try {
    const { id } = req.params;
    // First check if judge exists
    const judgeExists = await pool.query('SELECT id FROM judges WHERE id = $1', [parseInt(id)]);
    if (judgeExists.rows.length === 0) {
      return res.status(404).json({ error: 'Judge not found' });
    }

    const result = await pool.query(`
      SELECT e.*, ej.role as judge_role 
      FROM events e
      JOIN event_judges ej ON e.id = ej.event_id
      WHERE ej.judge_id = $1
      ORDER BY e.start_date
    `, [parseInt(id)]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching judged events:', error);
    res.status(500).json({ error: 'Failed to fetch judged events' });
  }
});

// Test route to verify database connection
router.get('/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ success: true, timestamp: result.rows[0].now });
  } catch (error: unknown) {
    console.error('Database connection test failed:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: 'Database connection failed', details: message });
  }
});

export default router; 