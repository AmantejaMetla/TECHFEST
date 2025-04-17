import { Request, Response } from 'express';
import { pool } from '../db/pool';

export class ParticipantsController {
  static async getParticipant(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query(
        'SELECT id, name, email, phone, bio, avatar_url FROM participants WHERE user_id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: 'Participant not found',
          details: 'No participant found with the provided ID'
        });
      }

      res.json(result.rows[0]);
    } catch (error: any) {
      console.error('Error getting participant:', error);
      res.status(500).json({
        error: 'Failed to get participant',
        details: error.message
      });
    }
  }

  static async updateParticipant(req: Request, res: Response) {
    const client = await pool.connect();
    try {
      const { id } = req.params;
      const { name, email, phone, bio, avatar_url } = req.body;

      // Start transaction
      await client.query('BEGIN');

      // Update participant
      const result = await client.query(
        `UPDATE participants 
         SET name = COALESCE($1, name),
             email = COALESCE($2, email),
             phone = COALESCE($3, phone),
             bio = COALESCE($4, bio),
             avatar_url = COALESCE($5, avatar_url)
         WHERE user_id = $6
         RETURNING id, name, email, phone, bio, avatar_url`,
        [name, email, phone, bio, avatar_url, id]
      );

      if (result.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({
          error: 'Participant not found',
          details: 'No participant found with the provided ID'
        });
      }

      // If email is updated, update it in users table too
      if (email) {
        await client.query(
          'UPDATE users SET email = $1 WHERE id = $2',
          [email, id]
        );
      }

      // Commit transaction
      await client.query('COMMIT');

      res.json({
        message: 'Profile updated successfully',
        participant: result.rows[0]
      });
    } catch (error: any) {
      await client.query('ROLLBACK');
      console.error('Error updating participant:', error);

      if (error.code === '23505') { // unique violation
        return res.status(400).json({
          error: 'Email already exists',
          details: 'A participant with this email already exists'
        });
      }

      res.status(500).json({
        error: 'Failed to update participant',
        details: error.message
      });
    } finally {
      client.release();
    }
  }
} 