//requieres para express
//variables de entorno
require('dotenv').config();

//Configuracion de las rutas
//#1. AUTHORS
const authorRoutes = require("./src/routes/author.routes");


//configuracion para express
const express = require('express');
const app = express();

//traigo la configuracion desde el archivo config.js en la carpeta config
const config = require('./src/config/config');

//middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.json());

//Registrar las rutas
app.use("/", authorRoutes);


//Array para almacenar posts en memoria
//const posts = [];
const {posts} = require("./src/data/posts");
//autoincrementador para los IDs de autores y posts
//let nextIdAuthor = authors.length + 1;
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



app.delete("/authors/:id", (req, res) =>{
    
})

//#2. POSTS


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


// GET /posts/author/:authorId - Obtener todos los posts con el detalle de su respectivo autor
app.get("/posts/author/:authorId", (req, res) => {
    // 1. Extraemos y validamos que el authorId sea un número
    const authorId = Number(req.params.authorId);

    if (Number.isNaN(authorId)) {
        return res.status(400).json({
            error: "authorId must be a number"
        });
    }

    // 2. Verificamos si el autor realmente existe en nuestra base de datos en memoria
    const authorExists = authors.find(a => a.id === authorId);
    if (!authorExists) {
        return res.status(404).json({
            error: "Author not found"
        });
    }

    // 3. Filtramos todos los posts que pertenezcan a este authorId
    const authorPosts = posts.filter(p => p.authorId === authorId);

    // 4. Mapeamos los posts encontrados para incrustar el objeto del autor dentro de cada uno
    const postsWithAuthorDetail = authorPosts.map(post => {
        return {
            id: post.id,
            title: post.title,
            content: post.content,
            published: post.published,
            created_at: post.created_at,
            author: {
                id: authorExists.id,
                name: authorExists.name,
                email: authorExists.email,
                bio: authorExists.bio
            }
        };
    });

    // 5. Respondemos con el array finalizado
    res.status(200).json(postsWithAuthorDetail);
});



//comprobacion que el puerto esta funcionando
app.listen(config.PORT, ()=>{
    console.log(`Servidor corriendo en el puerto http://localhost:${config.PORT} en modo ${config.NODE_ENV}`);
})






