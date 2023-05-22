const path = require('path');
const Public_files = require('../models_db/model_pufiles');

const func = require('../middleware/functions');

exports.upload_file_and_model_public = (req, res) =>{
    func.check_and_return(res, user_name, 400, 'Missing data_name');
    func.check_and_return(res, req.file, 400, 'Missing file in request');
    let path_moved = path.join(__dirname, '..', 'data', 'public', req.file.filename);
    fs.renameSync(req.file.path, path_moved);
    fs.stat(path_moved, (err, stats) => {
        if (err) {
            return func.returnSM(res, 500, 'Failed to get file size', err);
        };
        let file_size = stats.size / (1024 * 1024); //? size in bytes to size in Megabytes
        let pu_file = new Public_files({
            path: path_moved,
            name: req.file.filename,
            size: file_size,
            owner: req.body.user_name,
        });
        pu_file.save()
        .then(func.returnSM(res, 201, 'Successfully uploaded the file in Public'))
        .catch(err => func.returnSM(res, 201, 'Error when save in database', err));
    });
};

exports.upload_some_public_files = (req, res) => { //TODO/ c'est juste un ^c ^v de upload multi prv files
    func.check_and_return(res, user_name, 400, 'Missing data_name');
    func.check_and_return(res, req.file, 400, 'Missing file in request');
    for(let i = 0; i < req.file.length; i++){
        let path_moved = path.join(__dirname, '..', 'data', 'public', req.file[i].filename);
        fs.renameSync(req.file[i].path, path_moved);
        fs.stat(path_moved, (err, stats) => {
            if (err) {
                return func.returnSM(res, 500, 'Failed to get file size', err);
            }
            let apublic_file = new Public_files({
                path: path_moved,
                name: req.file.filename,
                size: stats.size / (1024*1024),
                owner: req.body.user_name,
            });
            apublic_file.save()
            .then(()=>{
                const save_count_of_pubFile = 0;
                save_count_of_pubFile += 1;
            })
            .catch(err => func.returnSM(res, 500, 'Error when get file size', err));
        });
    };
    if(save_count_of_pubFile < req.file.length){
        return func.returnSM(res, 500, 'Error when save a file in database')
    };
    func.returnSM(res, 201, 'Successfully uploaded the file in Public');
};
  