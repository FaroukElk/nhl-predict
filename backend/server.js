const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const predictionRoutes = require('./routes/prediction');
const bodyParser = require('body-parser');
const app = express();

mongoose.connect('mongodb://localhost:27017/nhl_predict')
  .then(() => console.log('Connected to database!'))
  .catch(() => console.log('Connection failed'));

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Headers', "Origin, X-Custom-Header, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader('Access-Control-Allow-Methods', "GET, POST, PATCH, DELETE, OPTIONS, PUT");
  next();
});

app.use('/users', userRoutes);
app.use('/games', predictionRoutes);
app.listen(3000);
