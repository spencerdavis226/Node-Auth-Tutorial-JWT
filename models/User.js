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

// Fire a function after doc saved to DB
userSchema.post('save', function (doc, next) {
  // .post is not a POST request. It just means "after", in this case post-saving.
  console.log('new user was created and saved', this);
  next();
});

// Fire a function before doc saved to DB
userSchema.pre('save', function (next) {
  console.log('user about to be created and saved', this);
  next();
});

const User = mongoose.model('user', userSchema); // model() must be singular of what our mongoDB is called (users)

module.exports = User;
