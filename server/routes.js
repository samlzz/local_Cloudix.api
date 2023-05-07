const express = require('express');
const router = express.Router();

const ctrl_user = require('./controllers/user');
const ctrl_file = require('./controllers/files');

//* User
router.post('/register', ctrl_user.check_username_exist);
router.post('/login', ctrl_user.check_id_exist_and_passwrd_valid);
//* Files
//TODO: à tester
router.post('/oneupload', ctrl_file.add_one_file_to_user);
router.post('/multiupload', ctrl_file.add_somme_files_to_user);
router.get('/fileofuser', ctrl_file.send_file_of_user);
router.delete('/delfile', ctrl_file.delete_a_file);
router.post('/rename', ctrl_file.rename_a_file);
router.post('/changecategorie', ctrl_file.change_categorie);

module.exports = router;