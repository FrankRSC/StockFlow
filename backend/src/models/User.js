const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  accessToken: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
  versionKey: false
});

module.exports = model('User', userSchema);
