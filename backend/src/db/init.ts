import { query } from '../config/database';
import * as fs from 'fs';
import * as path from 'path';

async function initializeDatabase() {
  try {
    // Read the SQL file
    const sqlFile = path.join(__dirname, 'init.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Execute the SQL commands
    await query(sql);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase(); 