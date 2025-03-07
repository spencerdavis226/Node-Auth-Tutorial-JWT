const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../secrets');

const requireAuth = (req, res, next) => {
  // Grab token from cookies
  const token = req.cookies.jwt; // jwt is what we defined name as for json web token

  // Check that json web token exists and is valid
  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/login');
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect('/login');
  }
};

module.exports = { requireAuth };
