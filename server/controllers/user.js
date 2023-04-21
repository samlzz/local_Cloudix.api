const express = require('express');
const mongoose = require('mongoose');

const User = require('../models_db/model_user');

exports.check_id_exist_and_passwrd_valid = (req, res, next) => {  //? check if the user who try to login is existing
    //* init variables:
    let user_who_log = req.body.User.username;  //TODO: a modifier quand j'aurais trouvé l'accès au nom d'utilisateur
    let mdp_who_log = req.body.User.password;  //TODO: ^^^ idem ^^^
    let err_t = false;
    User.findOne({ data_name: user_who_log })
        .then(usersname_l => { 
            //? --->
            if(usersname_l?.data_name === user_who_log) {   //? check if the user are found great
                let mess = 'User find';
                //? --->
                if( usersname_l.password === mdp_who_log) {   //? check if the password matches
                    mess += 'and password is correct';
                } else {
                    err_t = true;
                    mess += 'but wrong password';
                }
            } else {  
                err_t = true;
                let mess = 'User dont find';
            }
            //? --->
            if (err_t) {    //? check if it have an error:
                res.status(400).json({ error: mess});
            } else {  
                res.status(200).json({ message: mess, user: usersname_l });
            }
        })
        .catch(error => res.status(400).json({ error }));
    next();
};

exports.check_username_exist = (req, res, next) => {   //? check if the username don't already exist
    let user_registry = req.body.username;
    usr_reg_min = user_registry.toLowerCase();
    User.findOne({ data_name: usr_reg_min }).select({data_name: 1})
        .then(usersname_r => {
            if (usersname_r?.data_name === usr_reg_min) {
                () => res.status(400).json({ error: 'Username already exists' });
            } else {  //? add new user
                const user = new User({
                    cookie: req.body.cookie, //TODO: frontend envoie cookie ? ou à générer
                    data_name: usr_reg_min,
                    username: user_registry,
                    password: req.body.password //TODO: chiffré le mdp
                });
                user.save()
                .then(() => res.status(201).json({ message: 'User was created' }))
                .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(400).json({ error }));
    next();
};
