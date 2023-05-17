const mongoose = require('mongoose');

exports.connexion = (req, res, next) => {
    const uri = 'mongodb+srv://Manager:fK0NfcW7IcKvT53w@cluster0.46xga.mongodb.net/Cloud?retryWrites=true&w=majority';
    var DB_status = "off";
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'), DB_status = "on")
    .catch(() => console.log('Connexion à MongoDB échouée !'), DB_status = "off");
    next();
};
