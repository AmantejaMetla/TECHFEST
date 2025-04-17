"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const twitter_routes_1 = __importDefault(require("./routes/twitter.routes"));
const results_routes_1 = __importDefault(require("./routes/results.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const categories_routes_1 = __importDefault(require("./routes/categories.routes"));
const sponsors_routes_1 = __importDefault(require("./routes/sponsors.routes"));
const judges_routes_1 = __importDefault(require("./routes/judges.routes"));
const participants_routes_1 = __importDefault(require("./routes/participants.routes"));
const event_categories_routes_1 = __importDefault(require("./routes/event.categories.routes"));
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
const host = 'localhost';
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'TechFest API',
            version: '1.0.0',
            description: 'API documentation for TechFest application',
        },
        servers: [
            {
                url: `http://localhost:${port}/api`,
                description: 'Development server',
            },
        ],
    },
    apis: ['./src/routes/*.ts'],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
// Routes
app.use('/api/results', results_routes_1.default);
app.use('/api/twitter', twitter_routes_1.default);
app.use('/api/auth', auth_routes_1.default);
app.use('/api/categories', categories_routes_1.default);
app.use('/api/sponsors', sponsors_routes_1.default);
app.use('/api/judges', judges_routes_1.default);
app.use('/api/participants', participants_routes_1.default);
app.use('/api/event-categories', event_categories_routes_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Something went wrong!' });
});
app.listen(port, () => {
    console.log(`Server is running at http://${host}:${port}`);
    console.log(`Twitter API endpoint: http://${host}:${port}/api/twitter`);
    console.log(`Swagger documentation: http://${host}:${port}/api-docs`);
});
exports.default = app;
