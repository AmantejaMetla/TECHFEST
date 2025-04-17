import { Request, Response } from 'express';
import { pool } from '../db/pool';

export class EventCategoriesController {
  static async getAllEventCategories(req: Request, res: Response) {
    try {
      const result = await pool.query(
        'SELECT * FROM event_categories'
      );
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch event categories' });
    }
  }

  static async getEventCategories(req: Request, res: Response) {
    try {
      const { eventId } = req.params;
      const result = await pool.query(
        'SELECT * FROM event_categories WHERE event_id = $1',
        [eventId]
      );
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch event categories' });
    }
  }

  static async addCategoryToEvent(req: Request, res: Response) {
    try {
      const { eventId, categoryId } = req.params;
      const result = await pool.query(
        'INSERT INTO event_categories (event_id, category_id) VALUES ($1, $2) RETURNING *',
        [eventId, categoryId]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add category to event' });
    }
  }

  static async removeCategoryFromEvent(req: Request, res: Response) {
    try {
      const { eventId, categoryId } = req.params;
      const result = await pool.query(
        'DELETE FROM event_categories WHERE event_id = $1 AND category_id = $2',
        [eventId, categoryId]
      );
      res.json({ message: 'Category removed from event' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to remove category from event' });
    }
  }
} 