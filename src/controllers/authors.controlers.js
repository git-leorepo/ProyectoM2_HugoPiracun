//Array para almacenar autores en memoria
//const authors = [];
//const {authors} = require("../data/authors");
//configutramos pool en este archivo
const {Pool} = require('pg');
const pool = require("../db/config");


//POST/authors
const createAuthors = async(req, res) => {
    try {
        //valores que se extraen del body
        const {name, email, bio} = req.body;
        
        //Validacion de campos requeridos        
        if(!name || !email){
            return res.status(400).json({
                error: "name and email are required"
            })
        }

        //Verificar si el email ya existe
        const emailCheck = await pool.query('SELECT * FROM authors WHERE email = $1', [email]);
        
        if (emailCheck.rows.length > 0) {
            return res.status(409).json({
                error: "An author with this email already exists"
            });
        }

        //Insertar el nuevo autor (la BD genera el ID y created_at)
        const consulta = await pool.query(
            'INSERT INTO authors(name, email, bio) VALUES($1, $2, $3) RETURNING *',
            [name, email, bio || '']
        );

        res.status(201).json(consulta.rows[0]);

    }catch(error) {
        console.error('Error creating author:', error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
}

//GET/authors
const getAllAuthors = async(req, res) => {
    try{
        const consulta= await pool.query('SELECT * FROM authors');
        //console.log(consulta);
        res.status(200).json(consulta.rows);
    
        //si lo quiero hacer desde Data
        //res.status(200).json(authors);

    }catch (error) {
        console.error('Error fetching author:', error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
}

//GET/authors/:id
const getAuthorsById = async(req, res) => {
    try {
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

        //Consultar la BD usando parámetros preparados (evita SQL injection)
        const consulta = await pool.query('SELECT * FROM authors WHERE id=$1', [id]);

        //Validar que el author existe
        if(consulta.rows.length === 0){        
            return res.status(404).json({
                error: "Author not found"
            });
        }

        //Si se encuentra el autor, se devuelve con un status 200
        res.status(200).json(consulta.rows[0]);
    } catch (error) {
        console.error('Error fetching author:', error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
}

//PUT/authors/:id
const updateAuthorsById = async(req, res) =>{
    try {
        //Extraer el id de authors
        const id = Number (req.params.id);
        //Validar que el ID es un número válido
        if(Number.isNaN(id)){
            return res.status(400).json({
                error: "ID must be a number"
            });
        }

        //Extrae los nuevos datos del body de la solicitud
        const {name, email, bio} = req.body;

        //Valida que el email y name no sean vacios
        if(!name || !email){
            return res.status(400).json({
                error: "name and email are required"
            })
        }

        //Verificar si el autor existe
        const authorExists = await pool.query('SELECT * FROM authors WHERE id = $1', [id]);
        
        if (authorExists.rows.length === 0){
            return res.status(404).json({
                error: "Author not found"
            })
        }

        //Actualizar el autor en la BD
        const consulta = await pool.query(
            'UPDATE authors SET name = $1, email = $2, bio = $3 WHERE id = $4 RETURNING *',
            [name, email, bio || '', id]
        );
        //Actualiza el registro y envia un codigo 200
        res.status(200).json(consulta.rows[0]);
    } catch (error) {
        console.error('Error updating author:', error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
}

//DELETE/authors/:id
const deleteAuthorsById = async(req, res) =>{
    try {
        //Extraer el id de authors
        const id = Number (req.params.id);
        //Validar que el ID es un número válido
        if(Number.isNaN(id)){
            return res.status(400).json({
                error: "ID must be a number"
            });
        }

        //Verificar si el autor existe
        const authorExists = await pool.query('SELECT * FROM authors WHERE id = $1', [id]);
        
        if (authorExists.rows.length === 0){
            return res.status(404).json({
                error: "Author not found"
            })
        }

        //Eliminar el autor de la BD
        const consulta = await pool.query('DELETE FROM authors WHERE id = $1 RETURNING *', [id]);

        res.status(200).json(consulta.rows[0]);
    } catch (error) {
        console.error('Error deleting author:', error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
}


module.exports = {createAuthors, getAllAuthors, getAuthorsById, updateAuthorsById, deleteAuthorsById};