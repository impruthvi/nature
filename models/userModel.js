const mongoose = require('mongoose');
const validator = require('validator');

// name,email,photo,passowrd
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: String,
  passowrd: {
    type: String,
    required: [true, 'Please provide a passowrd'],
    minlength: 8
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your passowrd']
  }
});

const User = mongoose.model('user', userSchema);
module.exports = User;
