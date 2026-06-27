//validacion de variables de entorno
const requiredEnvVars = [
    'PORT',
    'NODE_ENV'
];

const optionalEnvVars = [
    'DATABASE_URL',
    'DB_URL',
    'API_KEY',
    'CORS_ORIGIN',
    'DB_HOST',
    'DB_PORT',
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD'
];

for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    console.warn(`Advertencia: La variable de entorno ${varName} no está definida. Se usará un valor por defecto.`);
  }
}

for (const varName of optionalEnvVars) {
  if (!process.env[varName]) {
    console.info(`Info: La variable de entorno opcional ${varName} no está definida.`);
  }
}

export default requiredEnvVars;