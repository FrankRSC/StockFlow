const Stock = require('../models/Stock');
const Movement = require('../models/Movement');

exports.getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find()
      .populate('product')
      .populate('branch');
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStockByBranch = async (req, res) => {
  try {
    const stocks = await Stock.find({ branch: req.params.branchId })
      .populate('product')
      .populate('branch');
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStock = async (req, res) => {
  const { product, branch, quantity } = req.body;

  if (!product || !branch || quantity === undefined) {
    return res.status(400).json({ message: 'Faltan campos requeridos: product, branch, quantity.' });
  }

  try {
    let stock = await Stock.findOne({ product, branch });
    let previousQuantity = 0;

    if (stock) {
      previousQuantity = stock.quantity;
      stock.quantity = quantity;
      await stock.save();
    } else {
      stock = new Stock({
        product,
        branch,
        quantity
      });
      await stock.save();
    }

    const diff = quantity - previousQuantity;
    if (diff !== 0) {
      const newMovement = new Movement({
        type: 'adjustment',
        product,
        quantity: diff,
        originBranch: diff < 0 ? branch : null,
        destinationBranch: diff > 0 ? branch : null
      });
      await newMovement.save();
    }

    const updatedStock = await Stock.findById(stock._id)
      .populate('product')
      .populate('branch');

    res.json(updatedStock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
