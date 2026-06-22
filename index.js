//==========================================
// REQUIRES Y CONFIGURACIÓN DE VARIABLES
//==========================================

//variables de entorno
//require('dotenv').config();
//const { loadEnvFile } = require('node:process');
import {loadEnvFile} from 'node:process';
loadEnvFile('.env');
/* 
//Configuracion de las variables de entorno requeridas para el proyect
const validarVariablesEntorno = require('./src/config/validateEnv');

//Configuracion del pool de src/db/config.js
const pool = require("./src/db/config");

//configuracion para express
const express = require('express');
const app = express();

//traigo la configuracion desde el archivo config.js en la carpeta config
const config = require('./src/config/config');

//Configuracion de OPENAPI
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./openapi.yaml');

//Configuracion de las rutas
//#1. AUTHORS
const authorRoutes = require("./src/routes/author.routes");
//#2. POSTS
const postRoutes = require("./src/routes/post.routes");

//==========================================
// MIDDLEWARE
//==========================================

//middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.json());

//Configuración de Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Registrar las rutas
app.use("/", authorRoutes);
app.use("/", postRoutes); */


//Array para almacenar posts en memoria
//const posts = [];
//const {posts} = require("./src/data/posts");
//autoincrementador para los IDs de autores y posts
//let nextIdAuthor = authors.length + 1;
//let nextIdPost = posts.length + 1;

const requiredEnvVars = [
    'PORT', 'NODE_ENV', 'DB_URL', 'API_KEY', 'CORS_ORIGIN',
    'DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'
];
for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    console.error(`Error: La variable de entorno ${varName} no está definida`);
    process.exit(1);
  }
}
console.log('Todas las variables de entorno requeridas están presentes');

const { default: app } = await import('./src/app.js');
const { default: config } = await import('./src/config/config.js');


//comprobacion que el puerto esta funcionando
app.listen(config.PORT, ()=>{
    console.log(`Servidor corriendo en el puerto http://localhost:${config.PORT} en modo ${config.NODE_ENV}`);
})

export default app;





