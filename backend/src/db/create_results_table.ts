import { query } from '../config/database';
import * as fs from 'fs';
import * as path from 'path';

async function createResultsTable() {
  try {
    // Read the SQL file
    const sqlFile = path.join(__dirname, 'create_results_table.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Execute the SQL commands
    await query(sql);
    console.log('Results table created successfully');
  } catch (error) {
    console.error('Error creating results table:', error);
    process.exit(1);
  }
}

createResultsTable(); 