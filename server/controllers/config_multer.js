const express = require('express');
const multer = require('multer');


var path_uploads = 'data';
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path_uploads);
  },
  filename: (req, file, callback) => {
    const data_name = file.originalname.split(' ').join('_');
    callback(null, Date.now() + '-' + data_name);
  }
});

module.exports =  multer({ storage: storage });