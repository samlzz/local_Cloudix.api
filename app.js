const express = require('express');
const mongoose = require('mongoose');
const User = require('./models_db/mod_user');

const app = express();

app.use(express.json());  //TODO intercepts all .json request and puts in req.body

//* connect to mongodb
const uri = 'mongodb+srv://Manager:fK0NfcW7IcKvT53w@cluster0.46xga.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use('', (req, res, next) => { //! midleware de test à supr plus tard 
    console.log('requete reçu');
    res.status(200).json('test');
    next();
});

/*
? ajoute l'utilisateurs du fichier "utilitest" a la base de données
const utilitest = require('./test/utilitest');
app.use('', (req, res, next) => {
  const utili = new User({
    ...utilitest
  });
  utili.save()
  console.log('enregistré')
});
*/

//* register
app.post('/register', (req, res, next) => {   //TODO check if the username don't already exist
  let user_registry = req.body.User.username; //? a modifier quand j'aurais trouvé l'accès au nom d'utilisateur
  user_registry = current_user.toLowerCase();
  User.findOne({ data_name: user_registry }).select({data_name: 1})
  .then(usersname_r => {
    if (usersname_r?.data_name === user_registry) {
      res.status(400).json({ error: 'Username already exists' });
    } else {
      res.status(200).json({ message: 'Valid username' });
    } })
  .catch(error => res.status(400).json({ error }));
  next();
});

//* login
app.post('/login', (req, res, next) => { //TODO check if the user who try to login is existing
  let user_who_log = req.body.User.username;  //? a modifier quand j'aurais trouvé l'accès au nom d'utilisateur
  user_who_log = user_who_log.toLowerCase();
  User.findOne({ data_name: user_who_log })
  .then(usersname_l => { res.status(200).json({ message: 'User find', user: usersname_l}) })
  .catch(error => res.status(400).json({error, message: 'User don t find'}));
});

module.exports = app;
