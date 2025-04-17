import { Router } from 'express';
import { pool } from '../db/pool';
import { ParticipantsController } from '../controllers/participants.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/participants:
 *   get:
 *     summary: Get all participants
 *     tags: [Participants]
 *     responses:
 *       200:
 *         description: List of participants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Participant ID
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   registered_at:
 *                     type: string
 *                     format: date-time
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM participants ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching participants:', error);
    res.status(500).json({ error: 'Failed to fetch participants' });
  }
});

/**
 * @swagger
 * /api/participants/{id}:
 *   get:
 *     summary: Get a participant by ID
 *     tags: [Participants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Participant ID
 *     responses:
 *       200:
 *         description: Participant details
 *       404:
 *         description: Participant not found
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM participants WHERE id = $1', [parseInt(id)]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Participant not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching participant:', error);
    res.status(500).json({ error: 'Failed to fetch participant' });
  }
});

/**
 * @swagger
 * /api/participants/{id}/events:
 *   get:
 *     summary: Get all events a participant is registered for
 *     tags: [Participants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Participant ID
 *     responses:
 *       200:
 *         description: List of registered events
 *       404:
 *         description: Participant not found
 */
router.get('/:id/events', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT e.*, ep.status as registration_status 
      FROM events e
      JOIN event_participants ep ON e.id = ep.event_id
      WHERE ep.participant_id = $1
      ORDER BY e.start_date
    `, [parseInt(id)]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching participant events:', error);
    res.status(500).json({ error: 'Failed to fetch participant events' });
  }
});

/**
 * @swagger
 * /api/participants/{id}/results:
 *   get:
 *     summary: Get all results for a participant
 *     tags: [Participants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Participant ID
 *     responses:
 *       200:
 *         description: List of participant results
 *       404:
 *         description: Participant not found
 */
router.get('/:id/results', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT r.*, e.title as event_title 
      FROM results r
      JOIN events e ON r.event_id = e.id
      WHERE r.participant_id = $1
      ORDER BY e.start_date
    `, [parseInt(id)]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching participant results:', error);
    res.status(500).json({ error: 'Failed to fetch participant results' });
  }
});

/**
 * @swagger
 * /api/participants/{id}:
 *   get:
 *     summary: Get participant profile
 *     description: Retrieve a participant's profile information
 *     tags: [Participants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The participant's user ID
 *     responses:
 *       200:
 *         description: Participant profile retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Participant not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authenticateToken, ParticipantsController.getParticipant);

/**
 * @swagger
 * /api/participants/{id}:
 *   put:
 *     summary: Update participant profile
 *     description: Update a participant's profile information
 *     tags: [Participants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The participant's user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               bio:
 *                 type: string
 *               avatar_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid request or email already exists
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Participant not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authenticateToken, ParticipantsController.updateParticipant);

export default router; 