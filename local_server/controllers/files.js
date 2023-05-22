const path = require('path');
const fs = require('fs');

const User = require('../models_db/model_user');
const Public_files = require('../models_db/model_pufiles');
const func = require('../middleware/functions');

exports.rename_a_file = (req, res)=>{
    if(!req.body.old_FN || !req.body.new_FN || !req.body.categorie || !req.body.user_id){
        return res.status(400).json({ message: 'Missing elements in request' });
    };
        User.findById(req.body.user_id)
        .then(user =>{
            if(req.body.categorie === 'private') {
                let file_to_rnm = user.folder.find(file => file.path.includes(req.body.old_FN));
                file_to_rnm = file_to_rnm?.path;
                let his_index = user.folder.findIndex(file => file.path === file_to_rnm);
                if (!file_to_rnm || his_index === -1){
                return res.status(404).json({ message: 'File to delete not found' });
                };
                let new_path = path.join(path.dirname(file_to_rnm), req.body.new_FN);
                user.folder[his_index].path = new_path;
                fs.rename(file_to_rnm, new_path, (err)=>{
                    if(err){
                        return res.status(500).json({ message: 'Err when rename the file', err })
                    };
                    user.save()
                    .then(() => res.status(201).json({ message: 'File renamed successfully' }))
                    .catch(error => res.status(400).json({ message: 'Err when save file path', error }));
                });
            } else if(req.body.categorie === 'public') {
                Public_files.find({ name: req.body.old_FN })
                .then(file =>{
                    if(user.username !== file.owner){
                        return res.status(401).json({ message: 'Try to rename a file from an other user'})
                    };
                    let new_path = path.join(path.dirname(file.path), req.body.new_FN);
                    fs.rename(file.path, new_path, (err)=>{
                        if(err){
                            return res.status(500).json({ message: 'Err when rename the file', err })
                        };
                        file.path = new_path;
                        file.name = req.body.new_FN;
                        file.save()
                        .then(() => res.status(201).json({ message: 'File renamed successfully' }))
                        .catch(error => res.status(400).json({ message: 'Err when save file path', error }));
                    });
                })
                .catch(error => res.status(500).json({ message: "Err when search the file", error }));
            } else {
                return res.status(400).json('Wrong categorie');
            }
        })
        .catch(error => res.status(500).json({ message: "Err when search the user", error }));
};

exports.change_private_file_to_public = (req, res)=>{
    if(!req.body.user_id || !req.body.filename){
        return res.status(400).json({ message: 'Missing informations in request'})
    };
    User.findById(req.body.user_id)
    .then(user=>{
        let file_to_chang = user.folder.find(file => file.path.includes(req.body.filename));
        file_to_chang = file_to_chang?.path;
        let his_index = user.folder.findIndex(file => file.path === file_to_chang);
        if (!file_to_chang || his_index === -1){
          return res.status(404).json({ message: 'Private file to change not found' });
        };
        user.folder.splice(his_index, 1);
        let his_file_name = path.basename(file_to_chang);
        let new_path = path.join(__dirname, '..', 'data', 'public', his_file_name);
        fs.renameSync(file_to_chang, new_path);
        fs.stat(new_path, (err, stats)=>{
            if (err) {
                return res.status(500).json({ message: 'Failed to get file size' , err});
            };
            let new_pubFile = new Public_files({
                path: new_path,
                name: his_file_name,
                size: stats.size / (1024*1024),
                owner: user.username,
            });
            new_pubFile.save()
            .then(()=>{
                user.save()
                .then(res.status(201).json({ message: 'Private file has correctly changed to public' }))
                .catch(error => res.status(500).json({ message: 'Error when delete private file path', error }));
            })
            .catch(error => res.status(500).json({ message: 'Error when save public file', error }));
        });
    })
    .catch(error => res.status(500).json({ message: "Err when search the user", error }));
};

exports.change_public_file_to_private = (req,res)=>{
    if(!req.body.user_id || !req.body.filename || !req.body.data_name){
        return res.status(400).json({ message: 'Missing informations in request'})
    };
    Public_files.findOneAndDelete({ name: req.body.filename })
    .then(file=>{
        let new_prvPath = path.join(__dirname, '..', 'data', req.body.data_name);
        if(!fs.stat(path_moved)) {  //? check if folder doesn't exist
            fs.mkdirSync(path_moved); //? and create it if it doesn't
        };
        new_prvPath = path.join(new_prvPath, file.name);
        fs.renameSync(file.path, new_prvPath);
        User.findById(req.body.user_id)
        .then(user=> {
            user.folder.push({ path: new_prvPath });
            user.save()
            .then(res.status(201).json({ message: 'Public file has correctly changed to private' }))
            .catch(error => res.status(500).json({ message: 'Error when add private file path', error }));
        })
        .catch(err=> res.status(500).json({ message: "Err when search the user", err }))
    })
    .catch(err=> res.status(500).json({ message: "Err when search the file", err }));
};