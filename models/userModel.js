const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password!'],
    validate: {
      validator: function (el) {
        // console.log(el);
        // this works only on SAVE and CREATE
        return el === this.password;
      },
      message: 'Passwords did not match!',
    },
  },
});

userSchema.pre('save', async function (next) {
  // run only if the password is modified
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
