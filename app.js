const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json()); // Takes JSON data that comes with requests, and parses into JS object. Then attaches that object to request body (req.body).

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
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', (req, res) => res.render('smoothies'));
app.use(authRoutes);
