//* IMPORTS
    const path = require('path');
    const fs = require('fs');

    const Public_files = require('../models_db/model_pufiles');
    const User = require('../models_db/model_user');
    const func = require('../middleware/functions');

    
//* FUNCTIONS

//public upload
    exports.upload_one_public_file = (req, res) => {
    //?save the public file(path, name, size, owner) in database
    func.check_and_return(res, req.body.user_id, 400, 'Missing user_id');
    func.check_and_return(res, req.file, 400, 'Missing file in request');
    let path_moved = path.join(
        __dirname,
        '..',
        'data',
        'public',
        req.file.filename
    );
    fs.renameSync(req.file.path, path_moved);
    fs.stat(path_moved, (err, stats) => {
        if (err) {
            return func.returnSM(res, 500, 'Failed to get file size', err);
        }
        User.findById(req.body.user_id)
            .then((user) => {
                let file_size = stats.size / (1024 * 1024); //? size in bytes to size in Megabytes
                let pu_file = new Public_files({
                path: path_moved,
                name: req.file.filename,
                size: file_size,
                owner: user.username,
                });
                pu_file
                .save()
                .then(() =>
                    func.returnSM(
                        res,
                        201,
                        'Successfully uploaded the file in Public'
                    )
                )
                .catch((err) =>
                    func.returnSM(res, 201, 'Error when save in database', err)
                );
            })
            .catch((err) =>
                func.returnSM(res, 500, 'Error when find the owner', err)
            );
    });
    };

//return pub files
    exports.send_all_public_files = (req, res) => {
    //?send all the public files(path, name, id_file, extension, owner)in a list
    let files_list = [];
    Public_files.find({})
        .cursor()
        .eachAsync((file) => {
            let two_name = file.name.split('-');
            files_list.push({
                path: file.path,
                name: two_name[1],
                id_file: two_name[0],
                extension: path.extname(file.path),
                owner: file.owner,
            });
            return Promise.resolve();
        })
        .then(() => func.returnFL(res, 200, files_list))
        .catch((err) =>
            func.returnSM(res, 500, 'Error when try to get public files', err)
        );
    };

//public download
    exports.return_public_to_download = (req, res) => {
    //?download the file on the computer of user
    func.check_and_return(res, req.body.filename, 400, 'Missing filename');
    Public_files.findOne({ name: req.body.filename })
        .then((file) => {
            res.download(file.path, (err) => {
                if (err) {
                func.returnSM(res, 500, 'Error when send file', err);
                }
            });
        })
        .catch((err) => func.returnSM(res, 500, 'Error when fin the owner', err));
    };


//*NEED TO DEV

    exports.upload_some_public_files = (req, res) => {
    func.check_and_return(res, req.body.username, 400, 'Missing data_name');
    func.check_and_return(res, req.file, 400, 'Missing file in request');
    for (let i = 0; i < req.file.length; i++) {
        let path_moved = path.join(
            __dirname,
            '..',
            'data',
            'public',
            req.file[i].filename
        );
        fs.renameSync(req.file[i].path, path_moved);
        fs.stat(path_moved, (err, stats) => {
            if (err) {
                return func.returnSM(res, 500, 'Failed to get file size', err);
            }
            let apublic_file = new Public_files({
                path: path_moved,
                name: req.file.filename,
                size: stats.size / (1024 * 1024),
                owner: req.body.username,
            });
            apublic_file
                .save()
                .then(() => {
                const save_count_of_pubFile = 0;
                save_count_of_pubFile += 1;
                })
                .catch((err) =>
                func.returnSM(res, 500, 'Error when get file size', err)
                );
        });
    }
    if (save_count_of_pubFile < req.file.length) {
        return func.returnSM(res, 500, 'Error when save a file in database');
    }
    func.returnSM(res, 201, 'Successfully uploaded the file in Public');
    };
