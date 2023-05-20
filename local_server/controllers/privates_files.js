const path = require('path');
const User = require('../models_db/model_user');

//* RETURN ALL FILE OF ONE USER
exports.send_file_of_user = (req, res) => {
  let files_list = [];
  User.findById(req.body.user_id)
  .then(user => {
    if (!user){
      return res.status(500).json({ message: 'User not found' });
    };
    for (let i = 0; i < user.folder.length; i++) {
      let path_file = user.folder[i].path;
      files_list.push({
        path: path_file, 
        name: path.basename(path_file),
        extension: path.extname(path_file)
      });
    };
    res.status(200).json(files_list);
  })
  .catch(error => res.status(500).json({ error }));
};

//* PUT PATH & SIZE COUNT ON MONGODB
exports.upload_one_private_file = (req, res) => {
  if(req.body.categorie !== "private"){
    return res.status(400).json({ message: "Request for a private file and it is a public file" });
  };
  let user_name = req.body.data_name;
  if (!user_name || !req.file){
    return res.status(400).json({ message: 'Missing file or data_name'});
  };
  let path_moved = path.join(__dirname, '..', 'data', user_name);
  if(!fs.stat(path_moved)) {  //? check if folder doesn't exist
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

//* DELETE A FILE
exports.delete_a_file = (req, res) => {
  User.findById(req.body.user_id)
  .then(user => {
    if (!user){
      return res.status(500).json({ message: 'User not found' });
    };
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
  if(req.body.categorie !== "private"){
    return res.status(400).json({ message: "Request for a private file and it is a public file" });
  };
  let user_name = req.body.data_name;
  if (!user_name || !req.file){
    return res.status(400).json({ message: 'Missing file or data_name'});
  };
  let path_moved = path.join(__dirname, '..', 'data', user_name);
  if(!fs.stat(path_moved)) {  //? check if folder doesn't exist
    fs.mkdirSync(path_moved); //? and create it if it doesn't
  };
  User.findById(req.body.user_id)
  .then(user => {
    if (!user){
      return res.status(500).json({ message: 'User not found' });
    };
    for(let i = 0; i < req.file.length; i++){
      path_moved = path.join(path_moved, req.file[i].filename);
      fs.renameSync(req.file[i].path, path_moved);
      fs.stat(path_moved, (err, stats) => {
        if (err) {
          return res.status(500).json({ message: 'Failed to get file size' , err});
        }
        user.folder.push({ path: path_moved });
        let file_size = stats.size / (1024 * 1024);
        user.size_count += file_size;
      });
    };
    user.save()
    .then(() => res.status(201).json({ message: 'File uploaded successfully' }))
    .catch(error => res.status(500).json({ message: 'Err when save file path', error }));
  })
  .catch(error => res.status(500).json({ message: "Err when search the user", error }));
};
