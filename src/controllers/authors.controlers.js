//Array para almacenar autores en memoria
//const authors = [];
const {authors} = require("../data/authors");

//POST/authors
const createAuthors = (req, res) => {
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
        id: authors.length +1,
        name,
        email,
        bio: bio || "",
        created_at: created_at || new Date().toISOString()
    }
    authors.push(newAuthor);

    res.status(201).json(newAuthor);
}

//GET/authors
const getAllAuthors = (req, res) => {
    res.status(200).json(authors);
}

//GET/authors/:id
const getAuthorsById = (req, res) => {
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
}

//PUT/authors/:id
const updateAuthorsById = (req, res) =>{
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
}

//DELETE/authors/:id
const deleteAuthorsById = (req, res) =>{
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
}


module.exports = {createAuthors, getAllAuthors, getAuthorsById, updateAuthorsById, deleteAuthorsById};