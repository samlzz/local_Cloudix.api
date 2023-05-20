const mongoose = require('mongoose');

exports.connexion = (req, res, next) => {
    if(!DB_status){
        var DB_status = "off";
    };
    if (DB_status !== "on") {
        const uri = 'mongodb+srv://Manager:fK0NfcW7IcKvT53w@cluster0.46xga.mongodb.net/Cloud?retryWrites=true&w=majority';
        mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            DB_status = "on";
            console.log("MongoDB are " + DB_status);
            req.body.DB_co = true;
        })
        .catch(() => {
            DB_status = "off";
            console.log("MongoDB are " + DB_status);
            req.body.DB_co = false;
        });
    };
    next();
};