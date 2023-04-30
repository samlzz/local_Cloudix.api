const express = require('express');
const mongoose = require('mongoose');

const User = require('../models_db/model_user');

//* LOGIN
exports.check_id_exist_and_passwrd_valid = (req, res, next) => {  //? check if the user who try to login is existing
    //* init variables:
    let user_who_log = req.body.username;  //TODO: vérifier l'accès au nom d'utilisateur
    let mdp_who_log = req.body.password;  //TODO: ^^^ idem ^^^
    User.findOne({ data_name: user_who_log })
        .then(user_l => {
            //? -->
            if (user_l === null) {  //? check if usernam are found
                res.status(401).json({ message: 'Username not found'});
            } else {
                //? -->
                if (mdp_who_log === user_l.password) {  //? check if passwords matches
                    res.status(200).json({ user_id: user_l._id, toker: 'TOKEN' });  //TODO: générer un token et le transmettre pour identifer la connexion
                } else {
                    res.status(401).json({ message: 'Wrong password'});
                }
            }
        })
        .catch(error => res.status(500).json({ error }));
    next();
};

//* REGISTER
exports.check_username_exist = (req, res, next) => {  //? check if the username don't already exist and add it to database if doesn't
    let user_registry = req.body.username;
    usr_reg_min = user_registry.toLowerCase(); //TODO: a supprimé si envoyé en minuscule
    User.findOne({ data_name: usr_reg_min }).select({data_name: 1})
        .then(user_r => {
            if (user_r?.data_name === usr_reg_min) {    //? check if 
                res.status(400).json({ error: 'Username already exists' });
            } else {  //? add new user
                const user = new User({
                    cookie: req.body.cookie, //TODO: frontend envoie cookie ? ou à générer
                    data_name: usr_reg_min,
                    username: user_registry,
                    password: req.body.password //TODO: chiffré le mdp ? ou frontend le fait 
                });
                user.save()
                .then(() => res.status(201).json({ message: 'User was created' }))
                .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(400).json({ error }));
    next();
};
