const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    let user_folder = JSON.parse(req.body.data_name);
    let path_uploads = path.join(__dirname, '..', 'data', user_folder);
    if(!fs.existsSync(path_uploads)) {  //? check if folder doesn't exist
      fs.mkdirSync(path_uploads);
    };
    callback(null, path_uploads);
  },

  filename: (req, file, callback) => {
    const data_name = file.originalname.split(' ').join('_');
    callback(null, Date.now() + '-' + data_name);
  }
});

module.exports = multer({ storage: storage });