const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const User = require('../models_db/model_user');
const init_mul = require('./config_multer');


exports.add_one_file_to_user = (req, res) => { 
    let user_name = req.body.username.toLowerCase();  //TODO: suprr .toL... si frontend envoie en min
    path_uploads = path.join(__dirname, 'data', user_name);
    //? -->
    if(!fs.existsSync(path_uploads)) {  //? check if folder doesn't exist
        fs.mkdirSync(path_uploads);
    };
    const upload = init_mul.single('upload-file');
    upload(req, res, err => {
        if (err) {
            return res.status(500).json({ err });
        };
    });
    User.findOne({ data_name: user_name})
    .then(user => {
      if (!user){
        return res.status(500).json({ message: 'User not found' });
      };
      user.folder.push({ 
        path: req.file.path, 
        categorie: req.body.categorie 
      });
      user.save();
      res.status(200).json({message: "File uploaded successfully."});
    })
    .catch(error => res.status(500).json({ error }));
};

exports.add_somme_files_to_user = (req, res) => {
    let user_name = req.body.username.toLowerCase();  //TODO: suprr .toL... si frontend envoie
    let file_class = req.body.categorie;  //TODO: a ajouter dans la base de donnée ?
    path_uploads = path.join(__dirname, 'data', user_name);
    //? -->
    if(!fs.existsSync(path_uploads)) {  //? check if folder doesn't exist
        fs.mkdirSync(path_uploads);
    };
    const upload = init_mul.array('upload-file', 12);
    upload(req, res, err => {
        if (err) {
            return res.status(500).json({ err });
        };
    });
    User.findOne({ data_name: user_name })
    .then(user => {
      checkif_founded(user);
      user.folder.push( req.file.path );
      user.save();
      res.status(200).json({ message: "File uploaded successfully." });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.send_file_of_user = (req, res) => {
  let name_user = req.body.username.toLowerCase();  //TODO: suprr .toL... si frontend envoie
  let files_list = [];
  User.findOne({ data_name: name_user })
  .then(user => {
    if (!user){
      return res.status(500).json({ message: 'User not found' });
    };
    for (let i = 0; i < user.folder.length; i++) {
      let path_file = user.folder[i].path;
      let class_fill = user.folder[i].categorie;
      let {na, ext} = path.parse(path_file);
      let stats = fs.statSync(path_file);
      files_list.push({
        path: path_file, 
        categorie: class_fill,
        name: na,
        extension: ext,
        size: stats.size, //? size in bytes
      });
    };
    res.status(200).json(files_list);
  })
  .catch(error => res.status(500).json({ error }));
};