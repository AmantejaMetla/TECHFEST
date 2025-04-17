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
const pool_1 = require("./pool");
function deleteUser() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Delete from participants first
            yield pool_1.pool.query('DELETE FROM participants WHERE user_id = 4');
            console.log('Deleted from participants table');
            // Then delete from users
            yield pool_1.pool.query('DELETE FROM users WHERE id = 4');
            console.log('Deleted from users table');
            process.exit(0);
        }
        catch (error) {
            console.error('Error:', error);
            process.exit(1);
        }
    });
}
deleteUser();
