const argon = require('argon2');

const User = require('../models_db/model_user');
const func = require('../middleware/functions');

//* LOGIN
exports.login = (req, res) => {  //? check if the user who try to login is existing
    func.check_and_return(res, req.body.password, 400, 'Missing password in request');
    func.check_and_return(res, req.body.data_name, 400, 'Missing data name in request');
    let mdp_who_log = req.body.password;
    User.findOne({ data_name: req.body.data_name })
        .then(user => {
            func.check_and_return(res, user, 401, 'Username not found')
            argon.verify(user.password, mdp_who_log) //? check if passwords matches
            .then(result => {
                if (result) {
                    return res.status(200).json({ user_id: user._id });
                } else {
                    return func.returnSM(res, 401, 'Wrong password');
                };
            })
            .catch(err => func.returnSM(res, 500, 'Error when hash password', err));
        })
        .catch(err => func.returnSM(res, 500, 'Error when search the user', err));
};

//* REGISTER
exports.register = (req, res) => {  //? check if the username don't already exist and add it to database if doesn't
    func.check_and_return(res, req.body.username, 400, 'Missing username in request');
    func.check_and_return(res, req.body.password, 400, 'Missing password in request');
    let usr_reg_min = req.body.username.toLowerCase(); //! nécessaire car j'ai besoin des deux id
    User.findOne({ data_name: usr_reg_min }).select({ data_name: 1 })
        .then(user => {
            if (user?.data_name === usr_reg_min) {
                return func.returnSM(res, 409, 'Username already exists');
            } else {  //? add new user
                argon.hash(req.body.password)
                .then(hash_of_mdp => {
                    const user = new User({
                        data_name: usr_reg_min,
                        username: req.body.username,
                        password: hash_of_mdp,
                        size_count: 0, 
                    });
                    user.save()
                    .then(() => {
                        User.findOne({ data_name: usr_reg_min })
                        .then(user => res.status(201).json({ status: 201, user_id: user._id, message: 'User was created' }))
                        .catch(err => func.returnSM(res, 500, 'Error when find user', err));
                    })
                    .catch(err => func.returnSM(res, 500, 'Error when save user', err));
                })
                .catch(err => func.returnSM(res, 500, 'Error when hash password', err));
            };
        })
        .catch(err => func.returnSM(res, 500, 'Error when search user', err));
};

//* DELETE ONE USER
exports.delete_user = (req, res) =>{
    User.findByIdAndDelete(req.body.user_id)
    .then(result => {
        if (!func.check_and_return(res, result, 404, "Don't find the user")){
            func.returnSM(res, 200, "Successfully delete the user");
        };
    })
    .catch(err => func.returnSM(res, 500, 'Error when search and delete the user', err));
};