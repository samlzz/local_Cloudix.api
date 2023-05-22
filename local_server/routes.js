const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const ctrl_user = require('./controllers/user');
const ctrl_prvfile = require('./controllers/privates_files');
const ctrl_pubfile = require('./controllers/public_files');
const ctrl_file = require('./controllers/files');
const mult = require('./middleware/multer_prvfile');
const Mongo = require('./middleware/mongoDB');

//* MONGODB
  router.get('/mongodb', Mongo.connexion, (req, res) => {
      let DB_is_co = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
      res.json("MongoDB is " + DB_is_co);
    });

//* USER
  router.post('/register', Mongo.connexion,  ctrl_user.register);
  router.post('/login', Mongo.connexion, ctrl_user.login);
  router.delete('/deluser', Mongo.connexion, ctrl_user.delete_user);

//* PRIVATES FILES
  router.post('/fileofuser', Mongo.connexion, ctrl_prvfile.send_file_of_user);
  router.post('/oneupload', Mongo.connexion, mult.single('upload-file'), ctrl_prvfile.upload_one_private_file);
  router.delete('/delfile', Mongo.connexion, ctrl_prvfile.delete_a_file);
  router.post('/multiupload', Mongo.connexion, mult.array('upload-file', 12), ctrl_prvfile.upload_some_private_files);  //TODO: a tester

//* PUBLIC FILES
  router.post('/onepubUpload', Mongo.connexion, mult.single('upload-file'), ctrl_pubfile.upload_file_and_model_public);
  router.post('/multipubUpload', Mongo.connexion, mult.array('upload-file', 12), ctrl_pubfile.upload_some_public_files);  //TODO: a tester

//* FILES   
  //TODO: a tester
  router.put('/rename', Mongo.connexion, ctrl_file.rename_a_file);  
  router.patch('/changeprv-pub', Mongo.connexion, ctrl_file.change_private_file_to_public);
  router.patch('/changepub-prv', Mongo.connexion, ctrl_file.change_public_file_to_private);

module.exports = router;