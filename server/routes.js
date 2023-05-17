const express = require('express');
const router = express.Router();
const multer = require('multer');

const ctrl_user = require('./controllers/user');
const ctrl_pubfile = require('./controllers/public_files');
const ctrl_prvfile = require('./controllers/privates_files');
const Mongo = require('./controllers/mongodb_co');
const mult = require('./controllers/multer');

//* USER
router.post('/register', Mongo.connexion, ctrl_user.check_username_exist);
router.post('/login', Mongo.connexion, ctrl_user.check_id_exist_and_passwrd_valid);
router.delete('/deluser', Mongo.connexion, ctrl_user.delete_user);

//* FILES
//router.post('/changecategorie', ctrl_file.change_categorie);
//* PRIVATE FILES
router.post('/fileofuser', Mongo.connexion, ctrl_prvfile.send_file_of_user);
router.post('/oneupload', Mongo.connexion, mult.single('upload-file'), ctrl_prvfile.upload_one_private_file);
router.delete('/delfile', Mongo.connexion, ctrl_prvfile.delete_a_file);

//router.post('/multiupload', ctrl_file.add_somme_files_to_user); 
//router.post('/rename', ctrl_file.rename_a_file);

//* PUBLIC FILES
//router.post('/publicupload', ctrl_pubfile.add_file_to_public);


module.exports = router;