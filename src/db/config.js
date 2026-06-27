//Configuracion de la BD
import pg from 'pg';
const { Pool } = pg;

export function resolveDbConfig() {
  const connectionString = process.env.DATABASE_URL || process.env.DB_URL;

  if (connectionString) {
    return {
      connectionString,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
    };
  }

  return {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || 'postgres',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || ''
  };
}

const pool = new Pool(resolveDbConfig());

export default pool;
