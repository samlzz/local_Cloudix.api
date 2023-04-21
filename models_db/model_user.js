const mongoose = require('mongoose');

const user_schema = mongoose.Schema({
  cookie: { type: String, required: true },
  data_name: { type: String, required: true},
  username: { type: String, required: true },
  password: { type: String, required: true },
  folder: { type: Array, required: true },
});

module.exports = mongoose.model('User', user_schema);