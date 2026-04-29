const { Schema, model } = require('mongoose');
const ObjectId = Schema.Types.ObjectId

const movementSchema = new Schema({
  type: { type: String, enum: ['in', 'out', 'transfer', 'adjustment'], required: true },
  product: { type: ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  originBranch: { type: ObjectId, ref: 'Branch' },
  destinationBranch: { type: ObjectId, ref: 'Branch' },
  status: { type: String, enum: ['pending', 'processed', 'failed'], default: 'pending' },
  failureReason: { type: String },
  attempts: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = model('Movement', movementSchema);
