import { pool } from './pool';

async function deleteUser() {
  try {
    // Delete from participants first
    await pool.query('DELETE FROM participants WHERE user_id = 4');
    console.log('Deleted from participants table');

    // Then delete from users
    await pool.query('DELETE FROM users WHERE id = 4');
    console.log('Deleted from users table');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

deleteUser(); 