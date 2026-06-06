//requieres para express
//variables de entorno
require('dotenv').config();
//configuracion para express
const express = require('express');
const app = express();




//traigo la configuracion desde el archivo config.js en la carpeta config
const config = require('./config/config');



//comprobacion que el puerto esta funcionando
app.listen(config.PORT, ()=>{
    console.log(`Servidor corriendo en el puerto ${config.PORT} en modo ${config.NODE_ENV}`);
})
