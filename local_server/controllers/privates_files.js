const path = require('path');
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
      files_list.push({
        path: path_file, 
        name: path.basename(path_file),
        extension: path.extname(path_file)
      });
    };
    func.returnSM(res, 200, files_list)
  })
  .catch(err => func.returnSM(res, 500, 'Error when search the user', err));
};

//* PUT PATH & SIZE COUNT ON MONGODB
exports.upload_one_private_file = (req, res) => {
  let user_name = req.body?.data_name;
  func.check_and_return(res, user_name, 400, 'Missing data_name');
  func.check_and_return(res, req.file, 400, 'Missing file in request');
  let path_moved = path.join(__dirname, '..', 'data', user_name);
  if(!fs.stat(path_moved)) {  //? check if folder doesn't exist
    fs.mkdirSync(path_moved); //? and create it if it doesn't
  };
  path_moved = path.join(path_moved, req.file.filename);
  fs.renameSync(req.file.path, path_moved);
  User.findById(req.body.user_id)
  .then(user => {
    func.check_and_return(res, user, 500, 'User not found');
    user.folder.push({ path: path_moved });
    fs.stat(path_moved, (err, stats) => {
      if (err) {
        return func.returnSM(res, 500, 'Failed to get file size', err);
      };
      let file_size = stats.size / (1024 * 1024);
      user.size_count += file_size;
      user.save()
       .then(func.returnSM(res, 201, 'File uploaded successfully'))
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
  if(!fs.stat(path_moved)) {  //? check if folder doesn't exist
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
    .then(func.returnSM(res, 201, 'File uploaded successfully'))
    .catch(err => func.returnSM(res, 500, 'Err when save file path', err));
  })
  .catch(err => func.returnSM(res, 500, 'Err when search the user', err));
};
