require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('./database');

const app = express();

app.use(express.json());
app.use(cors());

const verifyJWT = require('./middlewares/authJwt');

// Rutas públicas
app.use("/api/auth", require('./routes/auth.routes'));

// Rutas protegidas con JWT
app.use(verifyJWT);

app.use("/api/example", require('./routes/example.routes'));
app.use("/api/products", require('./routes/product.routes'));
app.use("/api/branches", require('./routes/branch.routes'));
app.use("/api/movements", require('./routes/movement.routes'));
app.use("/api/stocks", require('./routes/stock.routes'));

module.exports = app;
