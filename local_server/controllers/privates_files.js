//* IMPORTS
  const path = require('path');
  const fs = require('fs');

  const User = require('../models_db/model_user');
  const func = require('../middleware/functions');

  
//* FUNCTIONS

//return prv files
  exports.send_all_file_of_user = (req, res) => {
    //?send all the files(path, name, id_file, extension) of a user in a list
    func.check_and_return(
        res,
        req.body.user_id,
        400,
        'Missing userID in request'
    );
    let files_list = [];
    User.findById(req.body.user_id)
        .then((user) => {
          func.check_and_return(res, user, 500, 'User not found');
          for (let i = 0; i < user.folder.length; i++) {
              let path_file = user.folder[i].path;
              let file_name = path.basename(path_file);
              let two_name = file_name.split('-');
              files_list.push({
                path: path_file,
                name: path.parse(two_name[1]).name,
                id_file: two_name[0],
                extension: path.extname(path_file),
              });
          }
          func.returnFL(res, 200, files_list);
        })
        .catch((err) =>
          func.returnSM(res, 500, 'Error when search the user', err)
        );
  };

//prv upload
  exports.upload_one_private_file = (req, res) => {
    //?save a file(path, size_count) of a user in database
    func.check_and_return(
        res,
        req.body.user_id,
        400,
        'Missing userID in request'
    );
    func.check_and_return(res, req.file, 400, 'Missing file in request');
    User.findById(req.body.user_id)
        .then((user) => {
          func.check_and_return(res, user, 500, 'User not found');
          let path_moved = path.join(__dirname, '..', 'data', user.data_name);
          if (!fs.existsSync(path_moved)) {
              //? check if folder doesn't exist
              fs.mkdirSync(path_moved); //? and create it if it doesn't
          }
          path_moved = path.join(path_moved, req.file.filename);
          fs.renameSync(req.file.path, path_moved);
          user.folder.push({ path: path_moved });
          fs.stat(path_moved, (err, stats) => {
              if (err) {
                return func.returnSM(res, 500, 'Failed to get file size', err);
              }
              let file_size = stats.size / (1024 * 1024);
              user.size_count += file_size;
              user
                .save()
                .then(() =>
                    res.setHeader('Location', '/').sendStatus(302).json({ status: 302, message: "File uploaded successfully" })
                )
                .catch((err) =>
                    func.returnSM(res, 500, 'Error when save the file', err)
                );
          });
        })
        .catch((err) => func.returnSM(res, 500, 'Error when find user', err));
  };

//del a file
  exports.delete_a_private_file = (req, res) => {
    //?delete a file of one user(database, folder 'data')
    func.check_and_return(
        res,
        req.body.user_id,
        400,
        'Missing userID in request'
    );
    func.check_and_return(
        res,
        req.body.filename,
        400,
        'Missing file name in request'
    );
    User.findById(req.body.user_id)
        .then((user) => {
          func.check_and_return(res, user, 500, 'User not found');
          let file_to_del = user.folder.find((file) =>
              file.path.includes(req.body.filename)
          );
          file_to_del = file_to_del?.path;
          let his_index = user.folder.findIndex(
              (file) => file.path === file_to_del
          );
          if (!file_to_del || his_index === -1) {
              return res
                .status(404)
                .json({ message: 'File to delete not found' });
          }
          fs.stat(file_to_del, (err, stats) => {
              if (err) {
                return res
                    .status(500)
                    .json({ message: 'Failed to get file size', err });
              }
              fs.unlink(file_to_del, (err) => {
                if (err) {
                    return res
                      .status(500)
                      .json({ message: 'Failed to delete file', err });
                }
                user.folder.splice(his_index, 1);
                let file_size = stats.size / (1024 * 1024); //? size in bytes to size in Megabytes
                user.size_count = user.size_count - file_size;
                user
                    .save()
                    .then(() =>
                      res
                          .status(201)
                          .json({ message: 'File removed successfully' })
                    )
                    .catch((error) =>
                      res
                          .status(400)
                          .json({ message: 'Err when save file path', error })
                    );
              });
          });
        })
        .catch((error) =>
          res.status(500).json({ message: 'Err when search the user', error })
        );
  };

//prv download
  exports.return_file_to_download = (req, res) => {
    //?download a file on the computer of the user
    func.check_and_return(res, req.body.user_id, 400, 'Missing user_id');
    func.check_and_return(res, req.body.filename, 400, 'Missing filename');
    User.findById(req.body.user_id)
        .then((user) => {
          let file_to_ret = user.folder.find((file) =>
              file.path.includes(req.body.filename)
          );
          func.check_and_return(res, file_to_ret, 401, 'User not found');
          res.download(file_to_ret.path, (err) => {
              if (err) {
                func.returnSM(res, 500, 'Error when send file', err);
              }
          });
        })
        .catch((err) => func.returnSM(res, 500, 'Error when fin the owner', err));
  };


//* NEED TO DEV

//multiple upload
  exports.upload_some_private_files = (req, res) => {
    func.check_and_return(res, req.file, 400, 'Missing file in request');
    func.check_and_return(
        res,
        req.body.user_id,
        400,
        'Missing userID in request'
    );
    User.findById(req.body.user_id)
        .then((user) => {
          func.check_and_return(res, user, 500, 'User not found');
          let path_moved = path.join(__dirname, '..', 'data', user.username);
          if (!fs.existsSync(path_moved)) {
              //? check if folder doesn't exist
              fs.mkdirSync(path_moved); //? and create it if it doesn't
          }
          for (let i = 0; i < req.file.length; i++) {
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
          }
          user
              .save()
              .then(() => func.returnSM(res, 201, 'File uploaded successfully'))
              .catch((err) =>
                func.returnSM(res, 500, 'Err when save file path', err)
              );
        })
        .catch((err) => func.returnSM(res, 500, 'Err when search the user', err));
  };
