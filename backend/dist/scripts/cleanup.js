"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pool_1 = require("../db/pool");
function cleanupUser(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield pool_1.pool.connect();
        try {
            yield client.query('BEGIN');
            // First get the user to check if they exist
            const userResult = yield client.query('SELECT id FROM users WHERE email = $1', [email]);
            if (userResult.rows.length === 0) {
                console.log('User not found');
                return;
            }
            const userId = userResult.rows[0].id;
            // Delete from participants table first (if exists)
            yield client.query('DELETE FROM participants WHERE user_id = $1', [userId]);
            console.log('Deleted from participants table');
            // Then delete from users table
            yield client.query('DELETE FROM users WHERE id = $1', [userId]);
            console.log('Deleted from users table');
            yield client.query('COMMIT');
            console.log('Successfully deleted user');
        }
        catch (error) {
            yield client.query('ROLLBACK');
            console.error('Error in cleanup:', error);
        }
        finally {
            client.release();
        }
    });
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
