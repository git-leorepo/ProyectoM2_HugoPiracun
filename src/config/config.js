module.exports = {
    PORT: process.env.PORT || 3001,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/myapp',
    API_KEY: process.env.API_KEY,
    CORS_ORIGIN: process.env.CORS_ORIGIN || '*'
}