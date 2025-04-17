import { pool } from '../db/pool';

async function cleanupUser(email: string) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // First get the user to check if they exist
    const userResult = await client.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      console.log('User not found');
      return;
    }

    const userId = userResult.rows[0].id;

    // Delete from participants table first (if exists)
    await client.query('DELETE FROM participants WHERE user_id = $1', [userId]);
    console.log('Deleted from participants table');
    
    // Then delete from users table
    await client.query('DELETE FROM users WHERE id = $1', [userId]);
    console.log('Deleted from users table');

    await client.query('COMMIT');
    console.log('Successfully deleted user');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error in cleanup:', error);
  } finally {
    client.release();
  }
}

// Run the cleanup
const email = 'amantejametla@gmail.com';
cleanupUser(email).then(() => {
  console.log('Cleanup complete');
  process.exit(0);
}).catch((error) => {
  console.error('Cleanup failed:', error);
  process.exit(1);
}); 