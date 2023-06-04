//* IMPORTS
  const express = require('express');
  const router = express.Router();
  const mongoose = require('mongoose');

//? all functions off routes are in folder 'controllers'
  const ctrl_user = require('./controllers/user');
  const ctrl_prvfile = require('./controllers/privates_files');
  const ctrl_pubfile = require('./controllers/public_files');
  //const ctrl_file = require('./controllers/files');
  const mult = require('./middleware/multer');


//* USER
  router.post('/register', ctrl_user.register);   //!need : username, password
  router.post('/login', ctrl_user.login);   //!need : data_name, password
  router.delete('/deluser', ctrl_user.delete_user);   //!need : user_id


//* PRIVATES FILES
  router.post('/fileofuser', ctrl_prvfile.send_all_file_of_user);
  router.post('/oneupload', mult.single('upload-file'), ctrl_prvfile.upload_one_private_file);
  router.delete('/delfile', ctrl_prvfile.delete_a_private_file);
  router.post('/download', ctrl_prvfile.return_file_to_download);


//* PUBLIC FILES
  router.post('/onepubUpload', mult.single('upload-file'), ctrl_pubfile.upload_one_public_file);
  router.get('/publicfiles', ctrl_pubfile.send_all_public_files);
  router.post('/pubdownload', ctrl_pubfile.return_public_to_download);
  

/*
TODO: à tester
  * FILES   
    router.put('/rename', Mongo.connexion, ctrl_file.rename_a_file);  
    router.patch('/changeprv-pub', Mongo.connexion, ctrl_file.change_private_file_to_public);
    router.patch('/changepub-prv', Mongo.connexion, ctrl_file.change_public_file_to_private);
  * PRIVATES FILES
    router.post('/multiupload', Mongo.connexion, mult.array('upload-file', 12), ctrl_prvfile.upload_some_private_files);
  * PUBLIC FILE
    router.post('/multipubUpload', Mongo.connexion, mult.array('upload-file', 12), ctrl_pubfile.upload_some_public_files);
*/


module.exports = router;