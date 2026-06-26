//Array para almacenar autores en memoria
//const authors = [];
/* const {posts} = require("../data/posts");
const {authors} = require("../data/authors"); */
import { posts } from "../data/posts.js";
import { authors } from "../data/authors.js";
import { SQLInjection, caracteresProhibidos } from "../test/validators.js";


//configutramos pool en este archivo
/* const {Pool} = require('pg');
const pool = require("../db/config"); */
import pg from 'pg';
const { Pool } = pg;
import pool from "../db/config.js";

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

        // Detectar intentos básicos de SQL injection        
        if (SQLInjection(title)===true){
            return res.status(400).json({
                error: "forbidden words SELECT, INSERT, UPDATE, DELETE, DROP"
            });
        }

        if (SQLInjection(content)===true){
            return res.status(400).json({
                error: "forbidden words SELECT, INSERT, UPDATE, DELETE, DROP"
            });
        }
        // Detectar caracteres potencialmente peligrosos
        if (caracteresProhibidos(title)===true){
            return res.status(400).json({
                error: "forbidden characters"
            })
        }
        
        if (caracteresProhibidos(content)===true){
            return res.status(400).json({
                error: "forbidden characters"
            })
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
        const consulta = await pool.query('SELECT * FROM posts ORDER BY id ASC');
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

        // Detectar intentos básicos de SQL injection        
        if (SQLInjection(title)===true){
            return res.status(400).json({
                error: "forbidden words SELECT, INSERT, UPDATE, DELETE, DROP"
            });
        }

        if (SQLInjection(content)===true){
            return res.status(400).json({
                error: "forbidden words SELECT, INSERT, UPDATE, DELETE, DROP"
            });
        }
        // Detectar caracteres potencialmente peligrosos
        if (caracteresProhibidos(title)===true){
            return res.status(400).json({
                error: "forbidden characters"
            })
        }
        
        if (caracteresProhibidos(content)===true){
            return res.status(400).json({
                error: "forbidden characters"
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
const getPostByAuthor = async(req, res) =>{
    const sql = `
        SELECT posts.id,
            posts.title,
            posts.content,
            posts.author_id,
            posts.published,
            posts.created_at,
            authors.name,
            authors.email,
            authors.bio        
        FROM posts 
            JOIN authors ON posts.author_id=authors.id
            WHERE posts.author_id=$1`;

    try{
        // 1. Extraemos y validamos que el authorId sea un número
        const authorId = Number(req.params.authorId);

        if (Number.isNaN(authorId)) {
            return res.status(400).json({
                error: "authorId must be a number"
            });
        }

        // 2. Verificamos si el autor existe en la BD
        const authorExists = await pool.query('SELECT * FROM authors WHERE id = $1', [authorId]);
        
        if (authorExists.rows.length === 0){
            return res.status(404).json({
                error: "Author not found"
            })
        }

        // 3. Obtenemos los posts del autor con el JOIN
        const consulta = await pool.query(sql, [authorId]);

        // 4. Respondemos con los datos
        res.status(200).json(consulta.rows);
    }catch (error) {
        console.error('Error fetching posts by author:', error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
}

export {createPosts, getAllPost, getPostById, updatePostById, deletePostById,getPostByAuthor};

