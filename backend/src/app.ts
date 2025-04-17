import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import twitterRoutes from './routes/twitter.routes';
import resultsRoutes from './routes/results.routes';
import authRoutes from './routes/auth.routes';
import categoriesRoutes from './routes/categories.routes';
import sponsorsRoutes from './routes/sponsors.routes';
import judgesRoutes from './routes/judges.routes';
import participantsRoutes from './routes/participants.routes';
import eventCategoriesRoutes from './routes/event.categories.routes';
import judgeRoutes from './routes/judge.routes';

const app = express();
const port = process.env.PORT || 5000;
const host = 'localhost';

// Middleware
app.use(cors());
app.use(express.json());

// Basic test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

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
        url: `http://localhost:${port}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Custom HTML for Swagger UI with auth token handling
const swaggerHtml = `
<!-- HTML for custom swagger UI -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>TechFest API Documentation</title>
    <link rel="stylesheet" type="text/css" href="./swagger-ui.css" />
    <link rel="stylesheet" type="text/css" href="index.css" />
    <link rel="icon" type="image/png" href="./favicon-32x32.png" sizes="32x32" />
    <link rel="icon" type="image/png" href="./favicon-16x16.png" sizes="16x16" />
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="./swagger-ui-bundle.js" charset="UTF-8"> </script>
    <script src="./swagger-ui-standalone-preset.js" charset="UTF-8"> </script>
    <script>
        window.onload = function() {
            // Get the token from localStorage
            const token = localStorage.getItem('swagger_token');
            
            const ui = SwaggerUIBundle({
                url: "/api-docs/swagger.json",
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout",
                requestInterceptor: (req) => {
                    if (token) {
                        req.headers.Authorization = 'Bearer ' + token;
                    }
                    return req;
                }
            });
            window.ui = ui;
        }
    </script>
</body>
</html>
`;

// Serve Swagger documentation with custom UI
app.get('/api-docs/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', (req, res) => {
  res.send(swaggerHtml);
});

// Routes
app.use('/api/results', resultsRoutes);
app.use('/api/twitter', twitterRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/sponsors', sponsorsRoutes);
app.use('/api/judges', judgesRoutes);
app.use('/api/participants', participantsRoutes);
app.use('/api/event-categories', eventCategoriesRoutes);
app.use('/api/judge', judgeRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server is running at http://${host}:${port}`);
  console.log(`Test endpoint: http://${host}:${port}/test`);
  console.log(`API Documentation: http://${host}:${port}/api-docs`);
});

export default app; 