import { Pool } from 'pg';

export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'results',
  password: '4613',
  port: 5432,
}); 