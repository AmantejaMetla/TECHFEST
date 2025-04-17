import { Router } from 'express';
import { TwitterController } from '../controllers/twitter.controller';

const router = Router();
const twitterController = new TwitterController();

/**
 * @swagger
 * components:
 *   schemas:
 *     Tweet:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Tweet ID in our database
 *         tweet_id:
 *           type: string
 *           description: Original Twitter/X tweet ID
 *         text:
 *           type: string
 *           description: Tweet content
 *         author:
 *           type: string
 *           description: Twitter/X username of the author
 *         hashtags:
 *           type: array
 *           items:
 *             type: string
 *           description: List of hashtags in the tweet
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: When the tweet was created
 */

/**
 * @swagger
 * /api/twitter:
 *   get:
 *     summary: Get stored tweets
 *     tags: [Twitter]
 *     responses:
 *       200:
 *         description: List of stored tweets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tweet'
 *       500:
 *         description: Failed to fetch tweets
 */
router.get('/', twitterController.getTweets);

/**
 * @swagger
 * /api/twitter/refresh:
 *   get:
 *     summary: Refresh tweets from Twitter/X API
 *     tags: [Twitter]
 *     responses:
 *       200:
 *         description: List of refreshed tweets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tweet'
 *       500:
 *         description: Failed to refresh tweets
 */
router.get('/refresh', twitterController.refreshTweets);

export default router; 