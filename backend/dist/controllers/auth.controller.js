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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const pool_1 = require("../db/pool");
const JWT_SECRET = process.env.JWT_SECRET || 'techfest2025-secret-key';
class AuthController {
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield pool_1.pool.connect();
            try {
                // Extract fields from request body
                const { fullName, email, password, role } = req.body;
                // Validate required fields
                if (!fullName || !email || !password) {
                    return res.status(400).json({
                        error: 'Missing required fields',
                        details: 'Full name, email, and password are required'
                    });
                }
                // Check if user already exists
                const existingUser = yield auth_service_1.AuthService.findUserByEmail(email);
                if (existingUser) {
                    return res.status(400).json({
                        error: 'User already exists',
                        details: 'A user with this email already exists'
                    });
                }
                // Start transaction
                yield client.query('BEGIN');
                try {
                    // Hash password
                    const salt = yield bcrypt_1.default.genSalt(10);
                    const hashedPassword = yield bcrypt_1.default.hash(password, salt);
                    // Create user record with role from request or default to participant
                    const userResult = yield client.query(`INSERT INTO users (username, email, password, role) 
           VALUES ($1, $2, $3, $4) 
           RETURNING id, username, email, role`, [fullName, email, hashedPassword, 'participant']);
                    const user = userResult.rows[0];
                    // Create participant record with correct field mapping
                    yield client.query(`INSERT INTO participants (user_id, name, email, phone) 
           VALUES ($1, $2, $3, $4)`, [user.id, fullName, email, null] // Explicitly set phone to null
                    );
                    // Commit transaction
                    yield client.query('COMMIT');
                    // Generate JWT token
                    const token = jsonwebtoken_1.default.sign({
                        id: user.id,
                        email: user.email,
                        role: user.role
                    }, JWT_SECRET, { expiresIn: '24h' });
                    // Return success response
                    res.status(201).json({
                        message: 'User registered successfully',
                        token,
                        user: {
                            id: user.id,
                            username: fullName,
                            email: user.email,
                            role: user.role
                        }
                    });
                }
                catch (innerError) {
                    yield client.query('ROLLBACK');
                    console.error('Inner registration error:', innerError);
                    throw innerError;
                }
            }
            catch (error) {
                console.error('Registration error:', error);
                if (error.code === '23505') {
                    return res.status(400).json({
                        error: 'Registration failed',
                        details: 'User with this email already exists'
                    });
                }
                res.status(500).json({
                    error: 'Registration failed',
                    details: error.message || 'An error occurred during registration'
                });
            }
            finally {
                client.release();
            }
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    return res.status(400).json({
                        error: 'Missing required fields',
                        details: 'Email and password are required'
                    });
                }
                // Find user by email
                const result = yield pool_1.pool.query(`SELECT u.id, u.username, u.email, u.password, u.role 
         FROM users u 
         WHERE u.email = $1`, [email]);
                if (result.rows.length === 0) {
                    return res.status(401).json({
                        error: 'Invalid credentials',
                        details: 'Email or password is incorrect'
                    });
                }
                const user = result.rows[0];
                const validPassword = yield bcrypt_1.default.compare(password, user.password);
                if (!validPassword) {
                    return res.status(401).json({
                        error: 'Invalid credentials',
                        details: 'Email or password is incorrect'
                    });
                }
                const token = jsonwebtoken_1.default.sign({
                    id: user.id,
                    email: user.email,
                    role: user.role
                }, JWT_SECRET, { expiresIn: '24h' });
                res.json({
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        role: user.role
                    }
                });
            }
            catch (error) {
                console.error('Login error:', error);
                res.status(500).json({
                    error: 'Login failed',
                    details: 'An error occurred during login'
                });
            }
        });
    }
}
exports.AuthController = AuthController;
