const { Schema, model } = require('mongoose');
const ObjectId = Schema.Types.ObjectId

const branchSchema = new Schema({
  name: { type: String, required: true },
  location: { type: String, required: true }
}, {
  timestamps: true
});

module.exports = model('Branch', branchSchema);
