"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'TECHFEST API',
            version: '1.0.0',
            description: 'API documentation for TECHFEST event management system',
        },
        servers: [
            {
                url: 'http://localhost:5000/api',
                description: 'Development server',
            },
        ],
        components: {
            schemas: {
                Event: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        name: { type: 'string' },
                        date: { type: 'string', format: 'date-time' },
                        location: { type: 'string' },
                        description: { type: 'string' },
                        image_url: { type: 'string' },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' },
                    },
                },
                Participant: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        name: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        phone: { type: 'string' },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' },
                    },
                },
                Judge: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        name: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        password: { type: 'string' },
                        bio: { type: 'string' },
                        photo_url: { type: 'string' },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' },
                    },
                },
                Result: {
                    type: 'object',
                    required: ['event_id', 'participant_id', 'judge_id'],
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        event_id: { type: 'string', format: 'uuid' },
                        participant_id: { type: 'string', format: 'uuid' },
                        judge_id: { type: 'string', format: 'uuid' },
                        technical_score: {
                            type: 'number',
                            minimum: 0,
                            maximum: 100,
                            description: 'Technical evaluation score (0-100)'
                        },
                        presentation_score: {
                            type: 'number',
                            minimum: 0,
                            maximum: 100,
                            description: 'Presentation and communication score (0-100)'
                        },
                        innovation_score: {
                            type: 'number',
                            minimum: 0,
                            maximum: 100,
                            description: 'Innovation and creativity score (0-100)'
                        },
                        total_score: {
                            type: 'number',
                            minimum: 0,
                            maximum: 300,
                            description: 'Sum of all scores (0-300)'
                        },
                        feedback: { type: 'string' },
                        status: {
                            type: 'string',
                            enum: ['pending', 'evaluated', 'published'],
                            default: 'pending'
                        },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.ts'], // Path to the API routes
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
