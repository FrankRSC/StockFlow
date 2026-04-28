//importa mongoose
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const URL = '';

// process.env.MONGODB_URI usa la direccon que esta en las variables de entorno si existe
// si no usa le direccion de URL
const URI = process.env.MONGODB_URI ? process.env.MONGODB_URI : URL;

//crear la coneccion con mongodb
mongoose.connect(URI);

const connection = mongoose.connection;

//hace la coneccion con mongodb
connection.once('open', () => {
    console.log('BD conectada');
});