const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const User = require('../models_db/model_user');
const Public_files = require('../models_db/model_public_files');

//* UPLOAD PUBLIC FILE
exports.add_file_to_public = (req, res) => {
    if('private' in req.body.categorie){
      return res.status(400).json({ message: "Request for a public file and it is a private file" });
    };
    if(!path_uploads){
      var path_uploads = path.join(__dirname, 'data', 'public');
    } else {
      path_uploads = path.join(__dirname, 'data', 'public');
    };
    if(req.file.length = 1){
      var Upload = init_mul.single('upload-file');
      Upload(req, res, err => {
        if (err) {
          return res.status(500).json({ err });
        };
      });
      let pu_files = new Public_files({
        path: path.join(path_uploads, req.file.originalname),
        name: req.file.originalname,
      });
      pu_files.save()
      .then(() => res.status(201).json({ message: 'File uploaded successfully' }))
      .catch(error => res.status(400).json({ error }));
    } else {
      var Upload = init_mul.array('upload-file', 12);
      Upload(req, res, err => {
        if (err) {
          return res.status(500).json({ err });
        };
      });
      let count = 0
      let list_error = []
      for(let i = 0; i<req.file.length; i++){
        let pu_files = new Public_files({
          path: path.join(path_uploads, req.file[i].originalname),
          name: req.file[i].originalname,
        });
        pu_files.save()
        .then(count = count+1)
        .catch(error => list_error.push(error));
      };
      if(count === req.file.length){
        res.status(201).json({ message: 'All files have beeing uploaded' });
      } else {
        res.status(400).json(list_error);
      }
    };
  };