const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

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
  role: {
    type: String,
    enum: ['admin', 'user', 'guide', 'local-guide'],
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
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetExpiry: {
    type: Date,
  },
});

userSchema.pre('save', async function (next) {
  // run only if the password is modified
  if (!this.isModified('password') || this.isNew) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPassword = async function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    // console.log(JWTTimestamp, changedTimestamp);
    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpiry = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
