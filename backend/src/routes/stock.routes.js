const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stock.controller');

router.get('/', stockController.getAllStocks);
router.get('/branch/:branchId', stockController.getStockByBranch);
router.post('/', stockController.updateStock);

module.exports = router;
