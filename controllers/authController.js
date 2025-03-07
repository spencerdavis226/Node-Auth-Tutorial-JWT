const User = require('../models/User');
const jwt = require('jsonwebtoken');

// HANDLE ERRORS
const handleErrors = (err) => {
  console.log(err.message, err.code); // Specific properties from mongoose validation errors
  let errors = { email: '', password: '' };

  // Incorrect email
  if (err.message === 'incorrect email') {
    // 'incorrect email' error is from User.js static login method
    errors.email = 'that email is not registered';
  }
  // Incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'that password is incorrect';
  }
  // Email already registered (11000 is duplicate error code)
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }

  // Validation errors
  if (err.message.includes('user validation failed')) {
    // Example err.errors object from Mongoose:
    // err.errors = {
    //   email: { message: "Please enter a valid email" },
    //   password: { message: "Minimum password length is 6 characters" }
    // }
    for (let field in err.errors) {
      // "field" will be "email" and then "password"
      errors[field] = err.errors[field].message; // Assigns corresponding message to errors.email and errors.password
    }
  }

  return errors;
};

// JSON Web Tokens
const { jwtSecret } = require('../secrets');
const maxAge = 3 * 24 * 60 * 60; // 3 days in seconds
const createToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: maxAge,
  }); // 2nd value is secret. Dont publish on public repository
};

const authController = {
  signup_get: (req, res) => {
    res.render('signup');
  },
  login_get: (req, res) => {
    res.render('login');
  },

  // SIGN UP
  signup_post: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.create({ email, password });
      const token = createToken(user._id); // Look on mongoDB. Each user has an _id
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 }); // maxAge in .cookie is measured in ms, so *1000 for 3 days
      res.status(201).json({ user: user._id });
    } catch (err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
  },

  // LOG IN
  login_post: async (req, res) => {
    const { email, password } = req.body; // console.log(req.body) shows object with email and password, since that was POST request
    try {
      const user = await User.login(email, password);
      const token = createToken(user._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json({ user: user._id });
    } catch (err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
  },

  // LOG OUT
  logout_get: (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 }); // Changing the JWT to an empty string, and it expires in 1ms
    res.redirect('/');
  },
};

module.exports = authController;
