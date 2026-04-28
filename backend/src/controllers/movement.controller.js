const Movement = require('../models/Movement');
const Stock = require('../models/Stock');
const Product = require('../models/Product');
const Branch = require('../models/Branch');

const movementCtrl = {};

movementCtrl.getMovements = async (req, res) => {
  try {
    const movements = await Movement.find()
      .populate('product')
      .populate('originBranch')
      .populate('destinationBranch')
      .sort({ createdAt: -1 });
    res.json(movements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

movementCtrl.createMovement = async (req, res) => {
  try {
    const { type, product, quantity, originBranch, destinationBranch } = req.body;

    if (!['in', 'out', 'transfer'].includes(type)) {
      return res.status(400).json({ message: 'Invalid movement type' });
    }

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be greater than 0' });
    }

    // Verify product exists
    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (type === 'in') {
      if (!destinationBranch) {
        return res.status(400).json({ message: 'Destination branch is required for entry' });
      }
      const branchExists = await Branch.findById(destinationBranch);
      if (!branchExists) {
        return res.status(404).json({ message: 'Destination branch not found' });
      }
    } else if (type === 'out') {
      if (!originBranch) {
        return res.status(400).json({ message: 'Origin branch is required for exit' });
      }
      const branchExists = await Branch.findById(originBranch);
      if (!branchExists) {
        return res.status(404).json({ message: 'Origin branch not found' });
      }
    } else if (type === 'transfer') {
      if (!originBranch || !destinationBranch) {
        return res.status(400).json({ message: 'Both origin and destination branches are required for transfer' });
      }
      if (originBranch.toString() === destinationBranch.toString()) {
        return res.status(400).json({ message: 'Origin and destination branches must be different' });
      }

      const originExists = await Branch.findById(originBranch);
      const destExists = await Branch.findById(destinationBranch);
      if (!originExists || !destExists) {
        return res.status(404).json({ message: 'One or both branches not found' });
      }
    }

    // Create movement record with status pending
    const newMovement = new Movement({
      type,
      product,
      quantity,
      originBranch: type === 'in' ? null : originBranch,
      destinationBranch: type === 'out' ? null : destinationBranch,
      status: 'pending'
    });

    await newMovement.save();

    res.status(201).json(newMovement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = movementCtrl;
