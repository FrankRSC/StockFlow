const { Schema, model } = require('mongoose');
const ObjectId = Schema.Types.ObjectId

const productSchema = new Schema({
  sku: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true }
}, {
  timestamps: true
});

module.exports = model('Product', productSchema);
