const express = require('express');

const router = express.Router();

const ctrl_login = require('../controllers/login');

//TODO: à tester
router.post('/', ctrl_login.check_id_passwrd);

module.exports = router;