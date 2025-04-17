"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const results_controller_1 = require("../controllers/results.controller");
/**
 * @swagger
 * components:
 *   schemas:
 *     Result:
 *       type: object
 *       required:
 *         - event_id
 *         - participant_id
 *         - score
 *       properties:
 *         event_id:
 *           type: integer
 *           description: Event identifier
 *         participant_id:
 *           type: integer
 *           description: Participant identifier
 *         position:
 *           type: integer
 *           description: Participant's position/rank
 *         score:
 *           type: number
 *           format: float
 *           description: Participant's score
 *         notes:
 *           type: string
 *           description: Additional notes or feedback
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: When the result was created
 */
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/events/{eventId}/participants/{participantId}/results:
 *   get:
 *     summary: Get results for a specific participant in an event
 *     tags: [Results]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Event ID
 *       - in: path
 *         name: participantId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Participant ID
 *     responses:
 *       200:
 *         description: Participant's result
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Result'
 *       404:
 *         description: Results not found
 *       500:
 *         description: Server error
 */
router.get('/:eventId/participants/:participantId/results', results_controller_1.ResultsController.getParticipantResults);
/**
 * @swagger
 * /api/events/{eventId}/results:
 *   get:
 *     summary: Get all results for an event
 *     tags: [Results]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Event ID
 *     responses:
 *       200:
 *         description: List of results
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Result'
 *       500:
 *         description: Failed to fetch results
 */
router.get('/:eventId/results', results_controller_1.ResultsController.getEventResults);
/**
 * @swagger
 * /api/events/{eventId}/participants/{participantId}/results:
 *   post:
 *     summary: Submit a result for a participant
 *     tags: [Results]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The event ID
 *       - in: path
 *         name: participantId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The participant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               score:
 *                 type: number
 *               position:
 *                 type: integer
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Result submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Result'
 *       500:
 *         description: Failed to submit result
 */
router.post('/:eventId/participants/:participantId/results', results_controller_1.ResultsController.submitResult);
exports.default = router;
