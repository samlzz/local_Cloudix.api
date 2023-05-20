const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const ctrl_user = require('./controllers/user');
const ctrl_prvfile = require('./controllers/privates_files');
const ctrl_pubfile = require('./controllers/public_files');
const ctrl_file = require('./controllers/files');
const mult = require('./middleware/multer_prvfile');
const Mongo = require('./middleware/mongoDB');
const multer = require('multer');

//* MONGODB
router.get('/mongodb', Mongo.connexion, (req, res) => {
    let DB_is_co = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json("MongoDB is " + DB_is_co);
  });

//* USER
router.post('/register', Mongo.connexion,  ctrl_user.check_username_exist);
router.post('/login', Mongo.connexion, ctrl_user.check_id_exist_and_passwrd_valid);
router.delete('/deluser', Mongo.connexion, ctrl_user.delete_user);

//* PRIVATES FILES
router.post('/fileofuser', Mongo.connexion, ctrl_prvfile.send_file_of_user);
router.post('/oneupload', Mongo.connexion, mult.single('upload-file'), ctrl_prvfile.upload_one_private_file);
router.delete('/delfile', Mongo.connexion, ctrl_prvfile.delete_a_file);
router.post('/multiupload', Mongo.connexion, mult.array('upload-file', 12), ctrl_prvfile.upload_some_private_files);

//* PUBLIC FILES
router.post('/onepubUpload', Mongo.connexion, mult.single('upload-file'), ctrl_pubfile.upload_file_and_model_public);
router.post('/multipubUpload', Mongo.connexion, mult.array('upload-file', 12), ctrl_pubfile.upload_some_public_files);

//* FILES
router.put('/rename', Mongo.connexion, ctrl_file.rename_a_file);  //TODO: a tester
router.patch('/changeprv-pub', Mongo.connexion, ctrl_file.change_private_file_to_public);  //TODO: a tester
router.patch('/changepub-prv', Mongo.connexion, ctrl_file.change_public_file_to_private);  //TODO: a tester

module.exports = router;