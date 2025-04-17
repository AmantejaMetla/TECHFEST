import { Request, Response } from 'express';
import { pool } from '../db/pool';

export class CategoriesController {
  static async getAllCategories(req: Request, res: Response) {
    try {
      const result = await pool.query(
        'SELECT * FROM categories ORDER BY name'
      );
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ 
        error: 'Failed to fetch categories',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async getCategoryById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query(
        'SELECT * FROM categories WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ 
          error: 'Category not found',
          details: 'No category found with the provided ID'
        });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching category:', error);
      res.status(500).json({ 
        error: 'Failed to fetch category',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async createCategory(req: Request, res: Response) {
    try {
      const { name, description } = req.body;

      if (!name || !description) {
        return res.status(400).json({
          error: 'Missing required fields',
          details: 'Name and description are required'
        });
      }

      const result = await pool.query(
        'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
        [name, description]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ 
        error: 'Failed to create category',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async updateCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const result = await pool.query(
        `UPDATE categories 
         SET name = COALESCE($1, name),
             description = COALESCE($2, description)
         WHERE id = $3
         RETURNING *`,
        [name, description, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ 
          error: 'Category not found',
          details: 'No category found with the provided ID'
        });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ 
        error: 'Failed to update category',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async deleteCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query(
        'DELETE FROM categories WHERE id = $1 RETURNING *',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ 
          error: 'Category not found',
          details: 'No category found with the provided ID'
        });
      }

      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ 
        error: 'Failed to delete category',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
} 