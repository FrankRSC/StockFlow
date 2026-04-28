const { Schema, model } = require('mongoose');
const ObjectId = Schema.Types.ObjectId

const movementSchema = new Schema({
  type: { type: String, enum: ['in', 'out', 'transfer', 'adjustment'], required: true },
  product: { type: ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  originBranch: { type: ObjectId, ref: 'Branch' },
  destinationBranch: { type: ObjectId, ref: 'Branch' }
}, {
  timestamps: true
});

module.exports = model('Movement', movementSchema);
