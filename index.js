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

//#1. AUTHORS

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

//Buscar un autor por ID

app.get("/authors/:id", (req, res) =>{
    //Extrae el ID de los parámetros de la ruta y lo convierte a número
    const id = Number (req.params.id);

    //Validar que el ID es un número válido
    if(Number.isNaN(id)){
        return res.status(400).json({
            error: "Invalid author ID"
        });
    }
    //Validar que el ID es positivo
    if(id <= 0){
        return res.status(400).json({
            error: "Author ID must be a positive integer"
        });
    }

    //Validar que el author existe
    const author = authors.find(a => a.id === id);

    //si author es undefined, significa que no se encontró un autor con ese ID
    if(!author){        
        return res.status(404).json({
            error: "Author not found"
        });
    }

    //Si se encuentra el autor, se devuelve con un status 200
    res.status(200).json(author);

})

//Actualizar un autor por ID
app.put("/authors/:id", (req, res) =>{
    //Extraer el id de authors
    const id = Number (req.params.id);
    //Validar que el ID es un número válido
    if(Number.isNaN(id)){
        return res.status(400).json({
            error: "Invalid author ID"
        });
    }

    //Extrae los nuevos datos del body de la solicitud
    const {name, email, bio, created_at} = req.body;

    //Valida quue el email y name no sean vacios
    if(!name || !email){
        return res.status(400).json({
            error: "name and email are required"
        })
    }

    //buscar el indice del autor a actualizar
    const index = authors.findIndex(a => a.id === id);

    //validar que el autor existe
    if (index === -1){
        return res.status(404).json({
            error: "Author not found"
        })
    }

    //Actualizar los datos del autor
    authors[index] = {
        id,
        name,
        email,
        bio: bio || "",
        created_at: authors[index].created_at
    }

    res.status(200).json(authors[index]); 

})

//#POSTS

//comprobacion que el puerto esta funcionando
app.listen(config.PORT, ()=>{
    console.log(`Servidor corriendo en el puerto http://localhost:${config.PORT} en modo ${config.NODE_ENV}`);
})




