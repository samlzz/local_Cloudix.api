const mongoose = require('mongoose');

const user_schema = mongoose.Schema({
  data_name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  folder: { type: Array, required: false },
  data_size: { type: Number, required: false }
});

module.exports = mongoose.model('User', user_schema);