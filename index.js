//requieres para express
//variables de entorno
require('dotenv').config();

//Configuracion de las rutas
//#1. AUTHORS
const authorRoutes = require("./src/routes/author.routes");
//#2. POSTS
const postRoutes = require("./src/routes/post.routes");


//configuracion para express
const express = require('express');
const app = express();

//traigo la configuracion desde el archivo config.js en la carpeta config
const config = require('./src/config/config');

//middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.json());

//Registrar las rutas
app.use("/", authorRoutes);
app.use("/", postRoutes);


//Array para almacenar posts en memoria
//const posts = [];
//const {posts} = require("./src/data/posts");
//autoincrementador para los IDs de autores y posts
//let nextIdAuthor = authors.length + 1;
//let nextIdPost = posts.length + 1;

//health endpoint para verificar que la API esta funcionando correctamente
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "API is healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: "1.0.0"
    })
})






//comprobacion que el puerto esta funcionando
app.listen(config.PORT, ()=>{
    console.log(`Servidor corriendo en el puerto http://localhost:${config.PORT} en modo ${config.NODE_ENV}`);
})






