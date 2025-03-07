const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');

const app = express();

// middleware
app.use(express.static('public')); // refers to folder named "public", making it available everywhere
app.use(express.json()); // Takes JSON data that comes with requests, and parses into a JS object. Then attaches that object to request body (req.body).
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const { username, password } = require('./secrets');
const dbURI = `mongodb+srv://${username}:${password}@nodetuts.4lhc2.mongodb.net/node-auth`;
mongoose
  .connect(dbURI)
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
app.get('/', (req, res) => res.render('home')); // Express looks for "home" within a "views" folder by default
app.get('/smoothies', (req, res) => res.render('smoothies'));
app.use(authRoutes);

// cookies
app.get('/set-cookies', (req, res) => {
  // res.setHeader('Set-Cookie', 'newUser=true'); // Built in cookie setter
  res.cookie('newUser', false); // cook-parser package allows this(.cookie). Easier than above default way
  res.cookie('isEmployee', true, {
    maxAge: 1000 * 60 * 60 * 24, // math = 1 day in ms. Cookie lasts 1 day, instead of just when session ends (leave page)
    httpOnly: true,
  });

  res.send('you got the cookies!');
});
app.get('/read-cookies', (req, res) => {
  const cookies = req.cookies;
  console.log(cookies.newUser);
  res.json(cookies);
});
