require('dotenv').config();
const express = require('express')
const cors = require('cors')
require('./database')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json());
app.use(cors());

//users rutes
app.use("/api/example", require('./routes/example.routes'));
app.use("/api/products", require('./routes/product.routes'));
app.use("/api/branches", require('./routes/branch.routes'));
app.use("/api/movements", require('./routes/movement.routes'));
app.use("/api/stocks", require('./routes/stock.routes'));


const startWorker = require('./worker');

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
  startWorker();
})
