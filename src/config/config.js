export default {
    PORT: Number(process.env.PORT || 3000),
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_URL: process.env.DATABASE_URL || process.env.DB_URL || 'postgresql://localhost:5432/postgres',
    API_KEY: process.env.API_KEY || 'dev-api-key',
    CORS_ORIGIN: process.env.CORS_ORIGIN || '*'
}