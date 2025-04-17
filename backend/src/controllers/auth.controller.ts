import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db/pool';

const JWT_SECRET = process.env.JWT_SECRET || 'techfest2025-secret-key';

export class AuthController {
  static async register(req: Request, res: Response) {
    const client = await pool.connect();
    
    try {
      // Extract fields from request body
      const { fullName, email, password, role } = req.body;

      // Validate required fields
      if (!fullName || !email || !password) {
        return res.status(400).json({ 
          error: 'Missing required fields',
          details: 'Full name, email, and password are required'
        });
      }

      // Check if user already exists
      const existingUser = await AuthService.findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ 
          error: 'User already exists',
          details: 'A user with this email already exists'
        });
      }

      // Start transaction
      await client.query('BEGIN');

      try {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user record with role from request or default to participant
        const userResult = await client.query(
          `INSERT INTO users (username, email, password, role) 
           VALUES ($1, $2, $3, $4) 
           RETURNING id, username, email, role`,
          [fullName, email, hashedPassword, 'participant']
        );
        
        const user = userResult.rows[0];

        // Create participant record with correct field mapping
        await client.query(
          `INSERT INTO participants (user_id, name, email, phone) 
           VALUES ($1, $2, $3, $4)`,
          [user.id, fullName, email, null]  // Explicitly set phone to null
        );

        // Commit transaction
        await client.query('COMMIT');

        // Generate JWT token
        const token = jwt.sign(
          { 
            id: user.id, 
            email: user.email,
            role: user.role 
          },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        // Return success response
        res.status(201).json({
          message: 'User registered successfully',
          token,
          user: {
            id: user.id,
            username: fullName,
            email: user.email,
            role: user.role
          }
        });

      } catch (innerError: any) {
        await client.query('ROLLBACK');
        console.error('Inner registration error:', innerError);
        throw innerError;
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.code === '23505') {
        return res.status(400).json({ 
          error: 'Registration failed',
          details: 'User with this email already exists'
        });
      }
      res.status(500).json({ 
        error: 'Registration failed',
        details: error.message || 'An error occurred during registration'
      });
    } finally {
      client.release();
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ 
          error: 'Missing required fields',
          details: 'Email and password are required'
        });
      }

      // Find user by email
      const result = await pool.query(
        `SELECT u.id, u.username, u.email, u.password, u.role 
         FROM users u 
         WHERE u.email = $1`,
        [email]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ 
          error: 'Invalid credentials',
          details: 'Email or password is incorrect'
        });
      }

      const user = result.rows[0];
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.status(401).json({ 
          error: 'Invalid credentials',
          details: 'Email or password is incorrect'
        });
      }

      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email,
          role: user.role 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        error: 'Login failed',
        details: 'An error occurred during login'
      });
    }
  }
} 