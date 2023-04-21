const express = require('express');

const router = express.Router();

const ctrl_register = require('../controllers/register');

router.post('/', ctrl_register.check_username);

module.exports = router;