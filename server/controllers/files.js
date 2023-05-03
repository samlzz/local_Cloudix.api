const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const User = require('../models_db/model_user');
const init_mul = require('./config_multer');


exports.add_one_file_to_user = (req, res) => {
    let user_name = req.body.User.data_name;
    let file_path = req.file.path;
    let file_name = req.file.filename;
    path_uploads = path.join(__dirname, 'data', user_name);
    if(!fs.existsSync(path_uploads)) {  //? vérifie si le dossier n'existe pas déja
        fs.mkdirSync(path_uploads);
    }
    const upload = init_mul.single('file');
    upload(req, res, err => {
        if (err) {
            return res.status(500).json({ err });
        }
    });
    User.findOne({ data_name: user_name})
    .then(user => {
      if (!user) {  //? check if user are found
        return res.status(500).json({ error: 'User not found' });
      }
      user.folder.push({ file_name, file_path });
      user.save();
      res.status(200).json({message: "File uploaded successfully."});
    })
    .catch(error => res.status(500).json({ error }));
};

exports.add_somme_files_to_user = (req, res) => {
    let user_name = req.body.User.data_name;
    let file_path = req.file.path;
    let file_name = req.file.filename;
    path_uploads = path.join(__dirname, 'data', user_name);
    if(!fs.existsSync(path_uploads)) {  //? vérifie si le dossier n'existe pas déja
        fs.mkdirSync(path_uploads);
    }
    const upload = init_mul.array('file', 12);
    upload(req, res, err => {
        if (err) {
            return res.status(500).json({ err });
        }
    });
    User.findOne({ data_name: user_name})
    .then(user => {
      if (!user) {  //? check if user are found
        return res.status(500).json({ error: 'User not found' });
      }
      user.folder.push({ file_name, file_path });
      user.save();
      res.status(200).json({message: "File uploaded successfully."});
    })
    .catch(error => res.status(500).json({ error }));
};