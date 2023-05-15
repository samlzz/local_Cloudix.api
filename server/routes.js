const express = require('express');
const router = express.Router();

const ctrl_user = require('./controllers/user');
const ctrl_file = require('./controllers/files');
const mult = require('./controllers/multer');

//* USER
router.post('/register', ctrl_user.check_username_exist);
router.post('/login', ctrl_user.check_id_exist_and_passwrd_valid);
//* FILES
//router.post('/changecategorie', ctrl_file.change_categorie);
//* PRIVATE FILES
router.get('/fileofuser', ctrl_file.send_file_of_user);
router.post('/oneupload', mult.single('upload-file'), ctrl_file.add_one_file_to_user);
/*
router.post('/multiupload', ctrl_file.add_somme_files_to_user); 
router.delete('/delfile', ctrl_file.delete_a_file);
router.post('/rename', ctrl_file.rename_a_file);
//* PUBLIC FILES
router.post('/publicupload', ctrl_file.add_file_to_public)
*/

module.exports = router;