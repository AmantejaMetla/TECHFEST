import { Router } from 'express';
import { pool } from '../db/pool';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     JudgeStats:
 *       type: object
 *       properties:
 *         pending:
 *           type: integer
 *           description: Number of pending evaluations
 *         completed:
 *           type: integer
 *           description: Number of completed evaluations
 *         total:
 *           type: integer
 *           description: Total number of events to judge
 */

/**
 * @swagger
 * /api/judge/stats:
 *   get:
 *     summary: Get judge's evaluation statistics
 *     tags: [Judge]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Judge statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JudgeStats'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'User ID not found in token' });
    }
    
    const judgeId = req.user.id;
    
    // Get counts of pending and completed evaluations
    const result = await pool.query(`
      SELECT 
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'evaluated' THEN 1 END) as completed,
        COUNT(*) as total
      FROM submissions s
      JOIN event_judges ej ON s.event_id = ej.event_id
      WHERE ej.judge_id = $1
    `, [judgeId]);

    const stats = result.rows[0] || { pending: 0, completed: 0, total: 0 };
    res.json(stats);
  } catch (error) {
    console.error('Error fetching judge stats:', error);
    res.status(500).json({ error: 'Failed to fetch judge statistics' });
  }
});

/**
 * @swagger
 * /api/judge/submissions:
 *   get:
 *     summary: Get recent submissions for the judge to evaluate
 *     tags: [Judge]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of submissions retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/submissions', authenticateToken, async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'User ID not found in token' });
    }
    
    const judgeId = req.user.id;
    
    const result = await pool.query(`
      SELECT 
        s.id as _id,
        e.title as event,
        u.username as "participant.username",
        s.status,
        s.submitted_at as "submittedAt"
      FROM submissions s
      JOIN events e ON s.event_id = e.id
      JOIN users u ON s.participant_id = u.id
      JOIN event_judges ej ON s.event_id = ej.event_id
      WHERE ej.judge_id = $1
      ORDER BY s.submitted_at DESC
      LIMIT 10
    `, [judgeId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

export default router; 