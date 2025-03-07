const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please enter an email'], // Wrapping in array allows mongoose validation. [value, custom error message if value fails]
    unique: true,
    lowercase: true,
    // Email validation with 3rd party validation package, validator
    validate: [isEmail, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Minimum password length is 6 characters'],
  },
});

// Fire a function before doc saved to DB
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(); // random characters to be added to beginning of password (pre hash)
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('user', userSchema); // model() must be singular of what our mongoDB is called (users)

module.exports = User;
