//* IMPORTS
    const express = require('express');
    const mongoose = require('mongoose');

    const the_router = require('./routes');


//* INIT APP
    const app = express();


//* CORS
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*'); //TODO: remplacer 'x' par l'adresse du frontend (ex:'https://cloudix.netlify.app')
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        next();
    });


//* CONNEXION MONGODB
    const uri = 'mongodb+srv://Manager:fK0NfcW7IcKvT53w@cluster0.46xga.mongodb.net/Cloud?retryWrites=true&w=majority';
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log("MongoDB are on") })
    .catch(() => { console.log("MongoDB are off") });


//* ALLOW ACCES TO DATA IN .JSON
    app.use(express.json());    //? for application/json
    app.use(express.urlencoded({ extended: true }));  //? for multipart/form-data  


//* SEND REQUEST TO ROUTER
    app.use('', the_router);


//* FOR DEV & TEST
    //check connexion to database

    app.get('/mongodb', (req, res, next) => {
        let DB_is_co = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
        res.json("MongoDB is " + DB_is_co);
        next();
    });

    //send file & data to a route
      //? the code are in the file './send_file.html'
    app.get('/testofupload', (req, res, next) => {
        res.sendFile(__dirname + '/send_file.html');
    });


module.exports = app;
