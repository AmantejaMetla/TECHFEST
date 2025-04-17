import { pool } from '../db/pool';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: string;
}

interface CreateUserParams {
  username: string;
  email: string;
  password: string;
  role: string;
}

export class AuthService {
  static async createUser(params: CreateUserParams) {
    const { username, email, password, role } = params;
    
    const result = await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role',
      [username, email, password, role]
    );
    
    return result.rows[0];
  }

  static async findUserByEmail(email: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  }

  static async findUserById(id: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }
} 