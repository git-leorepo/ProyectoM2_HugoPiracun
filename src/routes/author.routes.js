//importo express
const express = require("express");
const router = express.Router();

//Datos de memoria temporal
const {authors} = require("../data/authors");

//Llamados desde authors.controllers
const {createAuthors, getAllAuthors, getAuthorsById, updateAuthorsById, deleteAuthorsById} =require("../controllers/authors.controlers");


//POST/authors
router.post("/authors", createAuthors);

//GET/authors
router.get("/authors", getAllAuthors);

//GET/authors/:id
router.get("/authors/:id", getAuthorsById);

//PUT/authors/:id
router.put("/authors/:id", updateAuthorsById);

//DELETE/authors/:id
router.delete("/authors/:id", deleteAuthorsById);

module.exports = router;


