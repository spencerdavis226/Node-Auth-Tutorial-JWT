const authController = {
  signup_get: (req, res) => {
    res.render('signup');
  },
  login_get: (req, res) => {
    res.render('login');
  },
  signup_post: (req, res) => {
    const { email, password } = req.body;
    res.send('new signup');
  },
  login_post: (req, res) => {
    const { email, password } = req.body; // console.log(req.body) shows object with email and password, since that was POST request
    res.send('signup');
  },
};

module.exports = authController;
