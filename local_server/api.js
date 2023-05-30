const express = require('express');
const mongoose = require('mongoose');

const the_router = require('./routes');
const func = require('./middleware/functions');

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
.then(() => {
    DB_status = "on";
    console.log("MongoDB are " + DB_status);
})
.catch(() => {
    DB_status = "off";
    console.log("MongoDB are " + DB_status);
    func.returnSM(res, 500, 'Failed to connect to database');
});

//* ALLOW ACCES TO DATA IN .JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//* SEND REQUEST TO ROUTER
app.use('', the_router);

//* TEST 
app.get('/testofupload', (req, res, next) => {
    res.sendFile(__dirname + '/send_file.html');
});

module.exports = app;
