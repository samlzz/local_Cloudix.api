const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const User = require('../models_db/model_user');
const Public_files = require('../models_db/model_public_files');


//* UPLOAD ONE PRIVATE FILE
exports.upload_one_private_file = (req, res) => {
  if(req.body.categorie !== "private"){
    return res.status(400).json({ message: "Request for a private file and it is a public file" });
  };
  if(!req.file){
    return res.status(400).json({ message: "File don't uploaded correctly"});
  };
  let user_name = req.body.data_name;
  if (!user_name){
    return res.status(400).json({ message: 'data_name not defined'});
  };
  let path_moved = path.join(__dirname, '..', 'data', user_name);
  if(!fs.existsSync(path_moved)) {  //? check if folder doesn't exist
    fs.mkdirSync(path_moved); //? and create it if it doesn't
  };
  path_moved = path.join(path_moved, req.file.filename);
  fs.renameSync(req.file.path, path_moved);
  User.findById(req.body.user_id)
  .then(user => {
    if (!user){
      return res.status(500).json({ message: 'User not found' });
    };
    user.folder.push({ path: path_moved });
    fs.stat(path_moved, (err, stats) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to get file size' , err});
      }
      let file_size = stats.size / (1024 * 1024);
      user.size_count += file_size;
      user.save()
       .then(() => res.status(201).json({ message: 'File uploaded successfully' }))
       .catch(error => res.status(500).json({ error }));
    });
  })
  .catch(error => res.status(500).json({ error }));
};

//* UPLOAD SOME PRIVATE FILES
exports.add_somme_files_to_user = (req, res) => {
  if('public' in req.body.categorie){
    return res.status(400).json({ message: "Request for privates files and it is a publics files" });
  };
  let user_name = req.body.username.toLowerCase();  //TODO: suprr .toL... si frontend envoie en min
  if(!path_uploads){
    var path_uploads = path.join(__dirname, 'data', user_name);
  } else {
    path_uploads = path.join(__dirname, 'data', user_name);
  };
  //? -->
  if(!fs.existsSync(path_uploads)) {  //? check if folder doesn't exist and create it
      fs.mkdirSync(path_uploads);
  };
  var Upload = init_mul.array('upload-file', 12);
  Upload(req, res, err => {
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
    .then(() => res.status(201).json({ message: 'Files uploaded successfully' }))
    .catch(error => res.status(400).json({ error }));
  })
  .catch(error => res.status(500).json({ error }));
};

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

//* RETURN FILES OF A USER
exports.send_file_of_user = (req, res) => {
  let files_list = [];
  User.findOne({data_name: req.body.data_name})
  .then(user => {
    if (!user){
      return res.status(500).json({ message: 'User not found' });
    };
    for (let i = 0; i < user.folder.length; i++) {
      let path_file = user.folder[i].path;
      let na = path.basename(path_file)
      let ext = path.extname(path_file);
      let stats = fs.statSync(path_file);
      files_list.push({
        path: path_file, 
        name: na,
        extension: ext,
        size: stats.size //? size in bytes
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

/* //TODO: Faire une fonction privé->public et inverse
//* PUBLIC --> PRIVE AND REVERSE
exports.change_categorie = (req, res) => {
  User.findOne({ data_name: req.body.data_name })
  .then(user => {
    let catt_index = user.folder.findIndex(req.body.filename);
    if(catt_index === -1){
      return res.status(404).json({ message: 'File to change categorie not found' });
    };
    if(req.body.categorie === 'private') {
      user.folder[catt_index].categorie = 'private';
    } else if(req.body.categorie === 'public') {
      user.folder[catt_index].categorie = 'public';
    } else {
      return res.status(400).json({ message: 'Invalid categorie are send' });
    };
    user.save()
      .then(() => res.status(201).json({ message: 'Categorie has been changed successfully' }))
      .catch(error => res.status(400).json({ error }));
  })
  .catch(error => res.status(500).json({ error }));
}; 
*/