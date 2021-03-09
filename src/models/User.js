const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 128
  },
  login: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 128
  },
  password: {
    type: String,
    required: true,
    minlength: 60,
    maxlength: 60
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'manager', 'employee', 'customer']
  }
});

module.exports = mongoose.model('User', userSchema);
