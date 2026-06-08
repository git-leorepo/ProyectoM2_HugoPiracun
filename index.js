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
//const authors = [];
const {authors} = require("./src/data/authors");
//Array para almacenar posts en memoria
//const posts = [];
const {posts} = require("./src/data/posts");
//autoincrementador para los IDs de autores y posts
let nextIdAuthor = authors.length + 1;
let nextIdPost = posts.length + 1;

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


//#1. AUTHORS

//GET./authors Consultar todos los autores
app.get("/authors", (req, res) => {
    res.status(200).json(authors);
});

//POST./authors Crear Authors
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
        id: nextIdAuthor++,
        name,
        email,
        bio: bio || "",
        created_at: created_at || new Date().toISOString()
    }
    authors.push(newAuthor);

    res.status(201).json(newAuthor);
})

//GET./authors/:id Buscar un autor por ID

app.get("/authors/:id", (req, res) =>{
    //Extrae el ID de los parámetros de la ruta y lo convierte a número
    const id = Number (req.params.id);

    //Validar que el ID es un número válido
    if(Number.isNaN(id)){
        return res.status(400).json({
            error: "ID must be a number"
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

//PUT./authors/:id Actualizar un autor por ID
app.put("/authors/:id", (req, res) =>{
    //Extraer el id de authors
    const id = Number (req.params.id);
    //Validar que el ID es un número válido
    if(Number.isNaN(id)){
        return res.status(400).json({
            error: "ID must be a number"
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

//DELETE./authors/:id Borrar un autor por ID
app.delete("/authors/:id", (req, res) =>{
    //Extraer el id de authors
    const id = Number (req.params.id);
    //Validar que el ID es un número válido
    if(Number.isNaN(id)){
        return res.status(400).json({
            error: "ID must be a number"
        });
    }

    //Buscar el indice del autor a eliminar
    const index = authors.findIndex(a => a.id === id);

    //Validar que el autor existe
    if (index === -1){
        return res.status(404).json({
            error: "Author not found"
        })
    }

    const deleted = authors.splice(index, 1)[0];
    res.status(200).json(deleted);

})

//#POSTS

//GET./posts consultar todos los posts
app.get("/posts", (req, res) => {
    res.status(200).json(posts);
})

//GET./posts/:id Consultar un post por ID
app.get("/posts/:id", (req, res) => {
    //Extraer el ID de los parámetros de la ruta y lo convierte a número
    const id = Number (req.params.id);

    //Validar que eñ id es valido
    if(Number.isNaN(id)){
        return res.status(400).json({
            error: "ID must be a number"
        })
    }
    //buscar el post por ID
    const post = posts.find(p => p.id === id);

    if (!post){
        //si el post no existe
        return res.status(404).json({
            error: "Post not found"
        })
    }

    //responder que el post fue encontrado
    res.status(200).json(post);
});

//POST./posts Crear un post
app.post("/posts", (req, res) => {
    //Extraer los datos del post del body de la solicitud
    const {authorId, title, content, published, created_at} = req.body;

    //Valuidacion de campos requeridos
    if(!authorId || !title || !content){
        return res.status(400).json({
            error: "authorId, title and content are required"
        });
    }
    
    //Crear el objeto Post
    const newPost = {
        id: nextIdPost++,
        title,
        content,
        authorId,                
        published: published || false, //si no viene sera false
        created_at: created_at || new Date().toISOString()
    }

    //Guardar el post en el array de posts
    posts.push(newPost);

    //Devolver el post creado con un status 201
    res.status(201).json(newPost);
});

//PUT./posts/:id Actualizar un post por ID

app.put("/posts/:id", (req, res) => {
    //Extrae el ID del endpoint
    const id = Number (req.params.id);

    if(Number.isNaN(id)){
        return res.status(400).json({
            error: "ID must be a number"
        })
    }

    //Extrae los nuevos datos del body
    const {authorId, title, content, published, created_at} = req.body;

    if(!title || !content || !authorId){
        return res.status(400).json({
            error: "title, or content, or authorId are required"
        })
    }

    //buscar el indice del post por ID en el array
    //findIndex devuelve la posicion del elemento array, sino lo encuentra devuelve -1
    const index = posts.findIndex (p => p.id === id);

    if(index ===-1){
        return res.status(404).json({
            error: "Post not found"
        })
    }

    posts[index] = {
        id,
        title,
        content,
        authorId,
        published,
        created_at
    }

    res.status(200).json(posts[index]);

});

//DELETE./posts/:id Eliminar el post
app.delete("/posts/:id", (req, res) => {
    //Extrae el id del endpoint
    const id = Number(req.params.id);

    if(Number.isNaN(id)){
        return res.status(400).json({
            error: "ID must be a number"
        })
    }

    //Buscar el indice del posts
    const index = posts.findIndex(p => p.id === id);

    //Validar que el indice exista    
    if(index === -1){
        return res.status(404).json({
            error: "Posts not found"
        })
    }

    //Elimina el posts con el indice indicado
    const deleted = posts.splice(index, 1)[0];

    //Cod de respuesta del posts eliminado
    res.status(200).json(deleted);
});



//comprobacion que el puerto esta funcionando
app.listen(config.PORT, ()=>{
    console.log(`Servidor corriendo en el puerto http://localhost:${config.PORT} en modo ${config.NODE_ENV}`);
})






