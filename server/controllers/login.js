const express = require('express');
const mongoose = require('mongoose');
const User = require('../models_db/model_user');

exports.check_id_passwrd = (req, res, next) => {  //? check if the user who try to login is existing
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