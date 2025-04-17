import { pool } from './pool';
import bcrypt from 'bcrypt';

async function fixPassword() {
  const client = await pool.connect();
  try {
    // Hash the password properly
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('TEST@!@#$', salt);

    // Update the password
    await client.query(
      'UPDATE users SET password = $1 WHERE email = $2',
      [hashedPassword, 'amantejametla@gmail.com']
    );

    console.log('Password updated successfully');
  } catch (error) {
    console.error('Error updating password:', error);
  } finally {
    client.release();
  }
}

fixPassword().then(() => process.exit()); 