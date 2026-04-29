// importa mongoose
const mongoose = require('mongoose');
const dns = require('dns');

// Intenta usar servidores DNS públicos para resolver problemas con registros SRV de Atlas
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (error) {
  console.warn('No se pudieron configurar los servidores DNS públicos:', error.message);
}

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