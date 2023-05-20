const express = require('express');
const mongoose = require('mongoose');

const the_router = require('./routes');

const app = express();

//* CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); //TODO: remplacer 'x' par l'adresse du frontend (ex:'https://cloudix.netlify.app')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//* ALLOW ACCES TO DATA IN .JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//* PUT REQUEST IN ROUTER
app.use('', the_router);

//* TEST 
app.get('/testofupload', (req, res, next) =>{
    res.sendFile(__dirname + '/send_file.html');
});

module.exports = app;
