import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import authorRoutes from './routes/author.routes.js';
import postRoutes from './routes/post.routes.js';

const app = express();

const swaggerDocument = YAML.load('./openapi.yaml');

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/', authorRoutes);
app.use('/', postRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'API is healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0'
    });
});

export default app;