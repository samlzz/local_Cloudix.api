const express = require('express');
const mongoose = require('mongoose');
const user = require('./models_db/mod_user');

const app = express();

app.use(express.json());  //TODO intercepts all .json request and puts in req.body

const uri = 'mongodb+srv://Manager:fK0NfcW7IcKvT53w@cluster0.46xga.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

user.find()
    .then(users => console.log(users))

app.use('', (req, res, next) => {
    console.log('requete reçu');
    res.status(200).json('test');
    next();
});

//* register

 app.post('/register', (req, res, next) => {    //TODO request register
    
 });

module.exports = app;
