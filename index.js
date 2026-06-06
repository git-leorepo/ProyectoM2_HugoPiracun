//requieres para express
//variables de entorno
require('dotenv').config();
//configuracion para express
const express = require('express');
const app = express();




//traigo la configuracion desde el archivo config.js en la carpeta config
const config = require('./config/config');

//middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.json());

//Array para almacenar autores en memoria
const authors = [];
let nextId = 1;

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


//Consultar todos los autores

app.get("/authors", (req, res) => {
    res.status(200).json(authors);
});

//Crear Authors
app.post("/authors", (req, res) =>{
    const {name, email, bio, created_at} = req.body;
    //Validacion de campos requeridos
    if(!name || !email){
        return res.status(400).json({
            error: "name and email are required"
        })
    }

    const emailExists = authors.some(author => author.email.toLowerCase() === email.toLowerCase());

    if (emailExists) {
        return res.status(409).json({ // 409 es el código HTTP correcto para Conflictos
            error: "An author with this email already exists"
        });
    }
    //Crear el objeto autor
    const newAuthor = {
        id: nextId++,
        name,
        email,
        bio: bio || "",
        created_at: created_at || new Date().toISOString()
    }
    authors.push(newAuthor);

    res.status(201).json(newAuthor);
})



//comprobacion que el puerto esta funcionando
app.listen(config.PORT, ()=>{
    console.log(`Servidor corriendo en el puerto http://localhost:${config.PORT} en modo ${config.NODE_ENV}`);
})
