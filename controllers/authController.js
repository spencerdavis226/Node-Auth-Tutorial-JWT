const authController = {
  signup_get: (req, res) => {
    res.render('signup');
  },
  login_get: (req, res) => {
    res.render('login');
  },
  signup_post: (req, res) => {
    res.send('new signup');
  },
  login_post: (req, res) => {
    res.render('signup');
  },
};

module.exports = authController;
