const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const User = require('../models_db/model_user');


router.post('/', (req, res, next) => {   //? check if the username don't already exist
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

module.exports = router;