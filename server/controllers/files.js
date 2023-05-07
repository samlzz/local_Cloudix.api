const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const User = require('../models_db/model_user');
const init_mul = require('./config_multer');


//* UPLOAD ONE FILE
exports.add_one_file_to_user = (req, res) => { 
    let user_name = req.body.username.toLowerCase();  //TODO: suprr .toL... si frontend envoie en min
    if(!path_uploads){
      var path_uploads = path.join(__dirname, 'data', user_name);
    } else {
      path_uploads = path.join(__dirname, 'data', user_name);
    };
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
        path: path.join(path_uploads, req.file.originalname), 
        categorie: req.body.categorie 
      });
      user.save()
      .then(() => res.status(201).json({ message: 'File uploaded successfully' }))
      .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

//* UPLOAD SOME FILES
exports.add_somme_files_to_user = (req, res) => {
  let user_name = req.body.username.toLowerCase();  //TODO: suprr .toL... si frontend envoie en min
  if(!path_uploads){
    var path_uploads = path.join(__dirname, 'data', user_name);
  } else {
    path_uploads = path.join(__dirname, 'data', user_name);
  };
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
  User.findOne({ data_name: user_name})
  .then(user => {
    if (!user){
      return res.status(500).json({ message: 'User not found' });
    };
    for(let i = 0; i<req.file.length; i++){
      user.folder.push({ 
        path:path.join(path_uploads, req.file[i].originalname), 
        categorie: req.body.categorie 
      });
    };
    user.save()
    .then(() => res.status(201).json({ message: 'File uploaded successfully' }))
    .catch(error => res.status(400).json({ error }));
  })
  .catch(error => res.status(500).json({ error }));
};

//* RETURN FILE OF A USER
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

//* DELETE
exports.delete_a_file = (req, res) => {
  User.findOne({ data_name: req.body.data_name })
  .then(user => {
    if (!user){
      return res.status(500).json({ message: 'User not found' });
    };
    let file_to_del = user.folder.find(file => file.path.includes(req.body.filename));
    let his_index = user.folder.findIndex(file_to_del);
    if (!file_to_del || his_index === -1){
      return res.status(404).json({ message: 'File to delete not found' });
    };
    fs.unlink(file_to_del, (err) => {
      if (err) {
        return res.status(500).json(err);
      };
      user.folder.splice(his_index, 1);
      user.save()
      .then(() => res.status(201).json({ message: 'File removed successfully' }))
      .catch(error => res.status(400).json({ error }));
    });
  })
  .catch(error => res.status(500).json({ error }));
};

//* RENAME
exports.rename_a_file = (req, res) => {
  User.findOne({ data_name: req.body.data_name })
  .then(user => {
    if (!user){
      return res.status(500).json({ message: 'User not found' });
    };
    let file_to_rnm = user.folder.find(file => file.path.includes(req.body.filename));
    let index_to_rnm = user.folder.findIndex(file_to_rnm);
    if (!file_to_rnm || index_to_rnm === -1){
      return res.status(404).json({ message: 'File to rename not found' });
    };
    let new_filepath = path.join(__dirname, 'data', user.data_name, req.body.new_filename);
    fs.rename(file_to_rnm, new_filepath, (err) => {
      if(err){
        return res.status(500).json(err);
      };
      user.folder[index_to_rnm].path = new_filepath;
      user.save()
      .then(() => res.status(201).json({ message: 'File renamed successfully' }))
      .catch(error => res.status(400).json({ error }));
    });
  })
  .catch(error => res.status(500).json({ error }));
};

//* PUBLIC --> PRIVE ET INVERSE
exports.change_categorie = (req, res) => {
  User.findOne({ data_name: req.body.data_name })
  .then(user => {
    let catt_index = user.folder.findIndex(req.body.filename);
    if(catt_index === -1){
      return res.status(404).json({ message: 'File to change categorie not found' });
    };
    if(req.body.categorie === 'private') {
      user.folder[catt_index].categorie = 'public';
    } else if(req.body.categorie === 'public') {
      user.folder[catt_index].categorie = 'private';
    } else {
      return res.status(400).json({ message: 'Invalid categorie are send' });
    };
    user.save()
      .then(() => res.status(201).json({ message: 'Categorie has been changed successfully' }))
      .catch(error => res.status(400).json({ error }));
  })
  .catch(error => res.status(500).json({ error }));
}; 