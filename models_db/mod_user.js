const mongoose = require('mongoose');

const user_schema = mongoose.Schema({
  cookie: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model('user', user_schema);