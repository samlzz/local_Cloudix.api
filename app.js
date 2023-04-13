const express = require('express');
const mongoose = require('mongoose');
const User = require('./models_db/model_user');

const app = express();

app.use(express.json());  //? intercepts all .json request and puts in req.body

//* connection to mongodb
const uri = 'mongodb+srv://Manager:fK0NfcW7IcKvT53w@cluster0.46xga.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


//* BEGIN OF MIDLEWARE: 

app.use('', (req, res, next) => { //TODO: à supr plus tard 
    console.log('requete reçu');
    res.status(200).json('test');
    next();
});


//* start register
app.post('/register', (req, res, next) => {   //? check if the username don't already exist
  let user_registry = req.body.User.username; //TODO: a modifier quand j'aurais trouvé l'accès au nom d'utilisateur
  User.findOne({ data_name: user_registry }).select({data_name: 1})
  .then(usersname_r => {
    if (usersname_r?.data_name === user_registry) {
      res.status(400).json({ error: 'Username already exists' });
    } else {
      res.status(200).json({ message: 'Valid username' });
    }
  })
  .catch(error => res.status(400).json({ error }));
  next();
});
//* end register


//* start login^
//TODO: à tester //
app.post('/login', (req, res, next) => {  //? check if the user who try to login is existing
  // init variables:
  let user_who_log = req.body.User.username;  //TODO: a modifier quand j'aurais trouvé l'accès au nom d'utilisateur
  let mdp_who_log = req.body.User.password;  //TODO: ^^^ idem ^^^
  let err_t = false;
  User.findOne({ data_name: user_who_log })
  .then(usersname_l => { 
    //? --->
    if(usersname_l?.data_name === user_who_log) {   //? check if the user are found great
      let mess = 'User find';
      //? --->
      if( usersname_l.password === mdp_who_log) {   //? check if the password matches
        mess += 'and password is correct';
      } else {
        err_t = true;
        mess += 'but wrong password';
      }
    } else {  
      err_t = true;
      let mess = 'User dont find';
    }
    //? --->
    if (err_t) {    //? check if it have an error:
      res.status(400).json({ error: mess});
    } else {  
      res.status(200).json({ message: mess, user: usersname_l });
    }
  })
  .catch(error => res.status(400).json({ error }));
});
//* end login

//* start upload
//TODO: a faire

//* end upload

//* END OF MIDLEWARE

module.exports = app;
