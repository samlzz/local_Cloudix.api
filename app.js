const express = require('express');
const mongoose = require('mongoose');
const user = require('./models_db/mod_user');

const app = express();

app.use(express.json());  //TODO intercepts all .json request and puts in req.body

//* connect to mongodb
const uri = 'mongodb+srv://Manager:fK0NfcW7IcKvT53w@cluster0.46xga.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use('', (req, res, next) => {
    console.log('requete reçu');
    res.status(200).json('test');
    next();
});

//* register
 app.post('/register', (req, res, next) => {    //TODO check if the username don't already exist
 let current_user = req.body.username; //? a modifier quand j'aurais trouvé l'accès au nom d'utilisateur
 current_user = current_user.toLowerCase();
 user.find({ $text: { $search: username }}).select(current_user)
  .then(usersname => {
    usersname = usersname.toLowerCase();
    if (usersname === current_user) {
      res.status(400).json({ error: 'Username already exists' });
    } else {
      res.status(200).json({ message: 'Valid username' });
    }
  });
 });

module.exports = app;
