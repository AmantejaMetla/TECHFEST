"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const event_controller_1 = require("../controllers/event.controller");
const router = (0, express_1.Router)();
/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Event ID
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         start_date:
 *           type: string
 *           format: date-time
 *         end_date:
 *           type: string
 *           format: date-time
 *         location:
 *           type: string
 *         status:
 *           type: string
 *           enum: [draft, published, completed, cancelled]
 *         created_at:
 *           type: string
 *           format: date-time
 *       required:
 *         - title
 *         - description
 *         - start_date
 *         - end_date
 *         - location
 *         - status
 */
/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: Event created successfully
 *       500:
 *         description: Failed to create event
 */
router.post('/events', event_controller_1.EventController.createEvent);
/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: List of events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       500:
 *         description: Failed to fetch events
 */
router.get('/events', event_controller_1.EventController.getAllEvents);
/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found
 *       500:
 *         description: Failed to fetch event
 */
router.get('/events/:id', event_controller_1.EventController.getEventById);
/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update an event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       404:
 *         description: Event not found
 *       500:
 *         description: Failed to update event
 */
router.put('/events/:id', event_controller_1.EventController.updateEvent);
/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Delete an event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       404:
 *         description: Event not found
 *       500:
 *         description: Failed to delete event
 */
router.delete('/events/:id', event_controller_1.EventController.deleteEvent);
/**
 * @swagger
 * /events/{eventId}/participants/{participantId}:
 *   post:
 *     summary: Add a participant to an event
 *     tags: [Events]
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
 *       201:
 *         description: Participant added successfully
 *       404:
 *         description: Event or participant not found
 *       500:
 *         description: Failed to add participant
 */
router.post('/events/:eventId/participants/:participantId', event_controller_1.EventController.addParticipant);
/**
 * @swagger
 * /events/{id}/participants:
 *   get:
 *     summary: Get all participants of an event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Event ID
 *     responses:
 *       200:
 *         description: List of participants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Participant'
 *       404:
 *         description: Event not found
 *       500:
 *         description: Failed to fetch participants
 */
router.get('/events/:id/participants', event_controller_1.EventController.getEventParticipants);
exports.default = router;
