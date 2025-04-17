import { pool } from './pool';
import { readFileSync } from 'fs';
import { join } from 'path';

async function resetDatabase() {
  try {
    // Read SQL files
    const dropSQL = readFileSync(join(__dirname, 'drop.sql'), 'utf8');
    const initSQL = readFileSync(join(__dirname, 'init.sql'), 'utf8');

    // Execute drop script
    console.log('Dropping existing tables...');
    await pool.query(dropSQL);

    // Execute init script
    console.log('Creating new tables and inserting sample data...');
    await pool.query(initSQL);

    console.log('Database reset completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  }
}

resetDatabase(); 