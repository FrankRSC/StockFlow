const { Schema, model } = require('mongoose');
const ObjectId = Schema.Types.ObjectId

const stockSchema = new Schema({
  product: { type: ObjectId, ref: 'Product', required: true },
  branch: { type: ObjectId, ref: 'Branch', required: true },
  quantity: { type: Number, required: true, default: 0 }
}, {
  timestamps: true
});

module.exports = model('Stock', stockSchema);
