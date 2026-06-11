//llamar a express
const express = require("express");
const router = express.Router();

//data desde el archivo data/posts
const {posts} = require("../data/posts");

const {createPosts, getAllPost, getPostById, updatePostById, deletePostById,getPostByAuthor} = require("../controllers/posts.controlers");

//POST/posts
router.post("/posts", createPosts);

//GET/posts
router.get("/posts", getAllPost);

// GET/posts/author/:authorId - Obtener todos los posts con el detalle de su respectivo autor
router.get("/posts/author/:authorId", getPostByAuthor);//esta debe ir antrs del post:id

/*
En posts.controlers.js: Falta importar authors. La función getPostByAuthor usa authors en la línea 146, pero no se importa.

En post.routes.js: El orden de las rutas es incorrecto. Express interpreta las rutas en orden, entonces /posts/author/:authorId debe ir ANTES de /posts/:id. De lo contrario, author se interpreta como el :id.
*/

//GET/posts/:id
router.get("/posts/:id", getPostById); 

//PUT/posts/:id
router.put("/posts/:id", updatePostById);

//DELETE./posts/:id
router.delete("/posts/:id", deletePostById);





module.exports = router;