const User = require('../models/User');

// HANDLE ERRORS
const handleErrors = (err) => {
  console.log(err.message, err.code); // Specific properties from mongoose validation errors
  let errors = { email: '', password: '' };

  // Duplicate error code
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

const authController = {
  signup_get: (req, res) => {
    res.render('signup');
  },
  login_get: (req, res) => {
    res.render('login');
  },
  signup_post: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.create({ email, password });
      res.status(201).json(user);
    } catch (err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
  },
  login_post: async (req, res) => {
    const { email, password } = req.body; // console.log(req.body) shows object with email and password, since that was POST request
    res.send('signup');
  },
};

module.exports = authController;
