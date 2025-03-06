const mongoose = require('mongoose');
const { isEmail } = require('validator');

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

const User = mongoose.model('user', userSchema); // model() must be singular of what our mongoDB is called (users)

module.exports = User;
