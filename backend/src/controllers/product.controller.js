const querys = require('../helpers/querys');

const productCtrl = {};

productCtrl.getProducts = async (req, res) => {
  try {
    const products = await querys.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

productCtrl.getProduct = async (req, res) => {
  try {
    const product = await querys.getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

productCtrl.createProduct = async (req, res) => {
  try {
    const { sku, name, price, category } = req.body;
    const newProduct = await querys.createProduct({ sku, name, price, category });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

productCtrl.updateProduct = async (req, res) => {
  try {
    const { sku, name, price, category } = req.body;
    const updatedProduct = await querys.updateProduct(
      req.params.id,
      { sku, name, price, category }
    );
    if (!updatedProduct) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

productCtrl.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await querys.deleteProduct(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = productCtrl;
