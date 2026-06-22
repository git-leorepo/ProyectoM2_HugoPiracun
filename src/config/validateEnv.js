//validacion de variables de entorno
const requiredEnvVars = [
    'PORT',
    'NODE_ENV',
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
    console.error(`Error: La variable de entorno ${varName} no está definida`);
    process.exit(1);
  }
}

console.log('Todas las variables de entorno requeridas están presentes');

export default requiredEnvVars;