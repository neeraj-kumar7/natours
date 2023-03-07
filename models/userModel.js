const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email!'],
    unique: [true, 'email already exists!'],
    validate: [validator.isEmail, 'Invalid email!'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please enter the password!'],
    minLength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password!'],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
