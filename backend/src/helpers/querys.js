const Product = require('../models/Product');
const Branch = require('../models/Branch');

const querys = {};

// Product Queries
querys.getAllProducts = async () => {
  return await Product.find();
};

querys.getProductById = async (id) => {
  return await Product.findById(id);
};

querys.createProduct = async (data) => {
  const newProduct = new Product(data);
  return await newProduct.save();
};

querys.updateProduct = async (id, data) => {
  return await Product.findByIdAndUpdate(id, data, { new: true });
};

querys.deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};

// Branch Queries
querys.getAllBranches = async () => {
  return await Branch.find();
};

querys.getBranchById = async (id) => {
  return await Branch.findById(id);
};

querys.createBranch = async (data) => {
  const newBranch = new Branch(data);
  return await newBranch.save();
};

querys.updateBranch = async (id, data) => {
  return await Branch.findByIdAndUpdate(id, data, { new: true });
};

querys.deleteBranch = async (id) => {
  return await Branch.findByIdAndDelete(id);
};

module.exports = querys;
