const express = require('express');
const mongoose = require('mongoose');

const routes_user = require('./routes/user')

//* connection to mongodb
const uri = 'mongodb+srv://Manager:fK0NfcW7IcKvT53w@cluster0.46xga.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(express.json());  //? intercepts all .json request and puts in req.body
app.use('/user', routes_user);

module.exports = app;