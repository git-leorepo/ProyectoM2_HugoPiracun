//importo express
//const express = require("express");
import express from "express";
const router = express.Router();

//Datos de memoria temporal
//const {authors} = require("../data/authors");
import {authors} from "../data/authors.js";

//Llamados desde authors.controllers
//const {createAuthors, getAllAuthors, getAuthorsById, updateAuthorsById, deleteAuthorsById} =require("../controllers/authors.controlers");
import {createAuthors, getAllAuthors, getAuthorsById, updateAuthorsById, deleteAuthorsById} from "../controllers/authors.controlers.js";


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

//module.exports = router;
export default router;


