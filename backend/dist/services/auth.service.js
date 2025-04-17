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
exports.AuthService = void 0;
const pool_1 = require("../db/pool");
class AuthService {
    static createUser(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, email, password, role } = params;
            const result = yield pool_1.pool.query('INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role', [username, email, password, role]);
            return result.rows[0];
        });
    }
    static findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield pool_1.pool.query('SELECT * FROM users WHERE email = $1', [email]);
            return result.rows[0] || null;
        });
    }
    static findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield pool_1.pool.query('SELECT * FROM users WHERE id = $1', [id]);
            return result.rows[0] || null;
        });
    }
}
exports.AuthService = AuthService;
