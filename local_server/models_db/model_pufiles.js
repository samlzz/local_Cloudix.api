const mongoose = require('mongoose');

const public_schema = mongoose.Schema({
    path: { type: String, required: true },
    name: { type: String, required: true },
    size: { type: Number, required: true },
    owner: { type: String, required: true },
});

module.exports = mongoose.model('public_files', public_schema);