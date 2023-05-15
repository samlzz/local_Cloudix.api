const express = require('express');
const mongoose = require('mongoose');

const the_router = require('./routes');

//* connection to mongodb
const uri = 'mongodb+srv://Manager:fK0NfcW7IcKvT53w@cluster0.46xga.mongodb.net/Cloud?retryWrites=true&w=majority';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();


app.use(express.json());  //? intercepts all .json request and puts in req.body
app.use(express.urlencoded({ extended: true }));
app.use('', the_router);

app.get('/testofupload', (req, res, next) =>{
  res.send(
      `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=", initial-scale=1.0">
          <title>Document</title>
      </head>
      <body>
          <form action="http://localhost:6699/oneupload" method="post">
              <input type="text" name="categorie" value="private">
              <input type="text" name="user_id" value="646280c38492bcf3da97de8c">
              <input type="text" name="data_name" value="test">
              <input type="file" name="upload-file" id="upload-file">
              <input type="submit" value="envoyer">
          </form>
      </body>
      </html>
      `
  );
  next();
});


module.exports = app;