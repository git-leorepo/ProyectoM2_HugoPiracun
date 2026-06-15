//Array para almacenar autores en memoria
//const authors = [];
/* const {posts} = require("../data/posts");
const {authors} = require("../data/authors"); */

//configutramos pool en este archivo
const {Pool} = require('pg');
const pool = require("../db/config");

//POST/posts
const createPosts = async(req, res) => {
    try{
        //Extraer los datos del post del body de la solicitud
        const {title, content, author_id, published} = req.body;

        //Validacion de campos requeridos
        if(!title || !content ||!author_id){
            return res.status(400).json({
                error: "authorId, title and content are required"
            });
        }

        //verificar si el autor ya existe
        const authorExist = await pool.query('SELECT * FROM authors WHERE id = $1', [author_id]);

        if(authorExist.rows.length === 0){
            return res.status(404).json({
                error: "Author not found"
            })
        }       
        
        const consulta = await pool.query('INSERT INTO posts(title, content, author_id, published) VALUES ($1, $2, $3, $4) RETURNING *', [title, content, author_id, published]);
        
        
        

        //Devolver el post creado con un status 201
        res.status(201).json(consulta.rows[0]);
    }catch(error){
        console.error('Error creating author:', error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
};

//GET/posts
const getAllPost = async(req, res) =>{
    try {
        const consulta = await pool.query('SELECT * FROM posts');
        res.status(200).json(consulta.rows);
    }catch(error){
        console.error('Error fetching author:', error);
        res.status(500).json({
            error: "Internal server error"
        });        
    }
    
};

//GET/posts/:id 
const getPostById = async(req, res) =>{
    try{
        //Extraer el ID de los parámetros de la ruta y lo convierte a número
        const id = Number (req.params.id);

        //Validar que eñ id es valido
        if(Number.isNaN(id)){
            return res.status(400).json({
                error: "ID must be a number"
            })
        }
    
        if(id<=0){
            return res.status(400).json({
                error: "Posts ID must be a positive integer" 
            })
        }

        //Consultar la BD usando parametros preparados
        const consulta = await pool.query('SELECT * FROM posts WHERE id=$1', [id]);

        const posts = consulta.rows;
        
        //buscar el post por ID
        const post = posts.find((post) => post.id ===id);

        //si el post no existe
        if (!post){
            //si el post no existe
            return res.status(404).json({
                error: "Post not found"
            })
    }

    //responder que el post fue encontrado
    res.status(200).json(consulta.rows[0]);
    }catch(error){
        console.error('Error fetching author:', error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
}

//PUT/posts/:id
const updatePostById = async(req, res) =>{
    try{
        //Extrae el ID del endpoint
        const id = Number (req.params.id);

        if(Number.isNaN(id)){
            return res.status(400).json({
                error: "ID must be a number"
            })
        }

        //Extrae los nuevos datos del body
        const {title, content, author_id, published} = req.body;

        if(!title || !content || !author_id){
            return res.status(400).json({
                error: "title, or content, or authorId are required"
            })
        }
        //verificar si el autor existe
        const authorExist = await pool.query('SELECT * FROM posts WHERE id = $1', [author_id]);

        if (authorExist.rows.length===0){
            return res.status(404).json({
                error: "Author not found"
            })
        }

        //Actualizar el post en la BD
        const consulta = await pool.query('UPDATE posts SET title=$1, content=$2, author_id=$3, published=$4 WHERE id=$5 RETURNING *', [title, content, author_id, published, id]);

        res.status(200).json(consulta.rows[0]);
    }catch(error) {
        console.error('Error updating author:', error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
}

//DELETE./posts/:id
const deletePostById = async(req, res) =>{
    try{
        //Extraer el ID de posts
        const id= Number(req.params.id);

        //Validar que el ID sea un numero valido
        if(Number.isNaN(id)){
            return res.status(400).json({
                error: "ID must be a number"
            });
        }

        //Verificar si el autor existe
        const postExists = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);

        if (postExists.rows.length ===0){
            return res.status(404).json({
                error: "Posts not found"
            })
        }

        //Eliminar el author de la BD
        const consulta = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING *', [id]);

        res.status(200).json(consulta.rows[0]);

    }catch(error) {
        console.error('Error deleting author:', error);
        res.status(500).json({
            error: "Internal server error"
        });
    }

}

// GET/posts/author/:authorId - Obtener todos los posts con el detalle de su respectivo autor
const getPostByAuthor = (req, res) =>{
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
}

module.exports = {createPosts, getAllPost, getPostById, updatePostById, deletePostById,getPostByAuthor};

