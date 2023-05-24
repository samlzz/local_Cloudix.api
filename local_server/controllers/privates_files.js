const path = require('path');
const fs = require('fs');

const User = require('../models_db/model_user');
const func = require('../middleware/functions');

//* RETURN ALL FILE OF ONE USER
exports.send_file_of_user = (req, res) => {
  let files_list = [];
  User.findById(req.body.user_id)
  .then(user => {
    func.check_and_return(res, user, 500, 'User not found');
    for (let i = 0; i < user.folder.length; i++) {
      let path_file = user.folder[i].path;
      let file_name = path.basename(path_file);
      let name_list = file_name.split('-')
      files_list.push({
        path: path_file, 
        name: name_list[1],
        id_file: name_list[0],
        extension: path.extname(path_file)
      });
    };
    func.returnSM(res, 200, files_list)
  })
  .catch(err => func.returnSM(res, 500, 'Error when search the user', err));
};

//* PUT PATH & SIZE COUNT ON MONGODB
exports.upload_one_private_file = (req, res) => {
  func.check_and_return(res, user_id, 400, 'Missing data_name');
  func.check_and_return(res, req.file, 400, 'Missing file in request');
  User.findById(req.body.user_id)
  .then(user => {
    func.check_and_return(res, user, 500, 'User not found');
    let path_moved = path.join(__dirname, '..', 'data', user.data_name);
    if(!fs.existsSync(path_moved)) {  //? check if folder doesn't exist
      fs.mkdirSync(path_moved); //? and create it if it doesn't
    };
    path_moved = path.join(path_moved, req.file.filename);
    fs.renameSync(req.file.path, path_moved);
    user.folder.push({ path: path_moved });
    fs.stat(path_moved, (err, stats) => {
      if (err) {
        return func.returnSM(res, 500, 'Failed to get file size', err);
      };
      let file_size = stats.size / (1024 * 1024);
      user.size_count += file_size;
      user.save()
       .then(() => func.returnSM(res, 201, 'File uploaded successfully'))
       .catch(err => func.returnSM(res, 500, 'Error when save the file', err));
    });
  })
  .catch(err => func.returnSM(res, 500, 'Error when find user', err));
};

//* DELETE A FILE
exports.delete_a_file = (req, res) => {
  User.findById(req.body.user_id)
  .then(user => {
    func.check_and_return(res, user, 500, 'User not found');
    let file_to_del = user.folder.find(file => file.path.includes(req.body.filename));
    file_to_del = file_to_del?.path;
    let his_index = user.folder.findIndex(file => file.path === file_to_del);
    if (!file_to_del || his_index === -1){
      return res.status(404).json({ message: 'File to delete not found' });
    };
    fs.stat(file_to_del, (err, stats) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to get file size' , err});
      };
      fs.unlink(file_to_del, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Failed to delete file' , err });
        };
      user.folder.splice(his_index, 1);
      let file_size = stats.size / (1024 * 1024); //? size in bytes to size in Megabytes
      //user.size_count = user.size_count - file_size;
      user.size_count = user.size_count - file_size;
      user.save()
      .then(() => res.status(201).json({ message: 'File removed successfully' }))
      .catch(error => res.status(400).json({ message: 'Err when save file path', error }));
      });
    });
  })
  .catch(error => res.status(500).json({ message: "Err when search the user", error }));
};

//* PUT PATH & SIZE COUNT OF EACH
exports.upload_some_private_files = (req, res) => {
  let user_name = req.body?.data_name;
  func.check_and_return(res, user_name, 400, 'Missing data_name')
  func.check_and_return(res, req.file, 400, 'Missing file in request')
  let path_moved = path.join(__dirname, '..', 'data', user_name);
  if(!fs.existsSync(path_moved)) {  //? check if folder doesn't exist
    fs.mkdirSync(path_moved); //? and create it if it doesn't
  };
  User.findById(req.body.user_id)
  .then(user => {
    func.check_and_return(res, user, 500, 'User not found');
    for(let i = 0; i < req.file.length; i++){
      path_moved = path.join(path_moved, req.file[i].filename);
      fs.renameSync(req.file[i].path, path_moved);
      fs.stat(path_moved, (err, stats) => {
        if (err) {
          return func.returnSM(res, 500, 'Failed to get size of', err);
        }
        user.folder.push({ path: path_moved });
        let file_size = stats.size / (1024 * 1024);
        user.size_count += file_size;
      });
    };
    user.save()
    .then(() => func.returnSM(res, 201, 'File uploaded successfully'))
    .catch(err => func.returnSM(res, 500, 'Err when save file path', err));
  })
  .catch(err => func.returnSM(res, 500, 'Err when search the user', err));
};

//* RETURN FILE TO CLIENT
exports.return_to_download = (req, res)=>{
  func.check_and_return(res, req.body.user_id, 400, 'Missing user_id');
  func.check_and_return(res, req.body.filename, 400, 'Missing user_id');
  User.findById(req.body.user_id)
  .then(user => {
    let file_to_ret = user.folder.find(file => file.path.includes(req.body.filename));
    func.check_and_return(res, file_to_ret, 401, 'User not found');
    res.download(file_to_ret.path, (err) => {
      if (err) {
        func.returnSM(res, 500, 'Error when send file', err);
      } else {
        func.returnSM(res, 200, 'File sent correctly');
      };
    });
  })
  .catch(err => func.returnSM(res, 500, 'Error when fin the owner', err));
};