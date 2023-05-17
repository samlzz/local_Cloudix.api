const express = require('express');
const mongoose = require('mongoose');

const the_router = require('./routes');

const app = express();


app.use(express.urlencoded({ extended: true }));
app.use('', express.json());  //? intercepts all .json request and puts in req.body
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
          <form action="http://localhost:6699/oneupload" method="post" enctype="multipart/form-data">
              <input type="hidden" name="categorie" value="private">
              <input type="text" name="user_id" value="6463d261d8133c7d9d61489d">
              <br>
              <input type="text" name="data_name" value="samuel">
              <input type="file" name="upload-file" id="upload-file">
              <input type="submit" value="envoyer">
          </form>
      </body>
      </html>
      `
  );
});


module.exports = app;