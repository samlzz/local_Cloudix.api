const express = require('express');
const mongoose = require('mongoose');
const argon = require('argon2');

const User = require('../models_db/model_user');

//* LOGIN
exports.check_id_exist_and_passwrd_valid = (req, res) => {  //? check if the user who try to login is existing
    let mdp_who_log = req.body.password;
    User.findOne({ data_name: req.body.data_name })
        .then(user_l => {
            console.log(user_l._id)
            //? -->
            if (user_l === null) {  //? check if username are found
                res.status(401).json({ message: 'Username not found'});
            } else {
                argon.verify(user_l.password, mdp_who_log) //? check if passwords matches
                .then(result => {
                    if (result) {
                        res.status(200).json({ user_id: user_l._id });
                    } else {
                        res.status(401).json({ message: 'Wrong password' });
                    }
                })
                .catch(error => res.status(500).json({ error: error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
};

//* REGISTER
exports.check_username_exist = (req, res) => {  //? check if the username don't already exist and add it to database if doesn't
    let usr_reg_min = req.body.username.toLowerCase(); //! nécessaire car j'ai besoin des deux id
    User.findOne({ data_name: usr_reg_min }).select({data_name: 1})
        .then(user_r => {
            if (user_r?.data_name === usr_reg_min) { 
                res.status(409).json({ error: 'Username already exists' });
            } else {  //? add new user
                argon.hash(req.body.password)
                .then(hash_ofmdp => {
                    const user = new User({
                        data_name: usr_reg_min,
                        username: req.body.username,
                        password: hash_ofmdp 
                    });
                    user.save()
                    .then(res.status(201).json({ message: 'User was created' }))
                    .catch(error => res.status(400).json({ error }));
                })
                .catch(error => res.status(500).json(error));
            }
        })
        .catch(error => res.status(500).json({ error }));
};