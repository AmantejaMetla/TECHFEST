"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const event_categories_controller_1 = require("../controllers/event.categories.controller");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/event-categories:
 *   get:
 *     summary: Get all event categories
 *     tags: [Event Categories]
 *     responses:
 *       200:
 *         description: List of all event categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   event_id:
 *                     type: string
 *                   category_id:
 *                     type: string
 *                   event_title:
 *                     type: string
 *                   category_name:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Failed to fetch event categories
 */
router.get('/', event_categories_controller_1.EventCategoriesController.getAllEventCategories);
/**
 * @swagger
 * /api/event-categories/{eventId}:
 *   get:
 *     summary: Get categories for a specific event
 *     tags: [Event Categories]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: List of categories for the event
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   event_id:
 *                     type: string
 *                   category_id:
 *                     type: string
 *                   category_name:
 *                     type: string
 *                   category_description:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Failed to fetch event categories
 */
router.get('/:eventId', event_categories_controller_1.EventCategoriesController.getEventCategories);
/**
 * @swagger
 * /api/event-categories/{eventId}/{categoryId}:
 *   post:
 *     summary: Add a category to an event
 *     tags: [Event Categories]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       201:
 *         description: Category added to event successfully
 *       400:
 *         description: Category already added to event
 *       404:
 *         description: Event or category not found
 *       500:
 *         description: Failed to add category to event
 */
router.post('/:eventId/:categoryId', event_categories_controller_1.EventCategoriesController.addCategoryToEvent);
/**
 * @swagger
 * /api/event-categories/{eventId}/{categoryId}:
 *   delete:
 *     summary: Remove a category from an event
 *     tags: [Event Categories]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category removed from event successfully
 *       404:
 *         description: Event category not found
 *       500:
 *         description: Failed to remove category from event
 */
router.delete('/:eventId/:categoryId', event_categories_controller_1.EventCategoriesController.removeCategoryFromEvent);
exports.default = router;
