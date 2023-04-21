const express = require('express');

const router = express.Router();

const ctrl_user = require('../controllers/user');

router.post('/register', ctrl_user.check_username_exist);
router.post('/login', ctrl_user.check_id_exist_and_passwrd_valid);//TODO: à tester

module.exports = router;