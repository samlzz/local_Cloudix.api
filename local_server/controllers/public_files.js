const path = require('path');
const Public_files = require('../models_db/model_pufiles');

exports.upload_file_and_model_public = (req, res) =>{
    if(req.body.categorie !== 'public'){
        return res.status(400).json({ message: "Request only for public file" });
    };
    if(!req.file || !req.body.user_name){
        return res.status(400).json({ message: "Wrong informations with the query"});
    };
    let path_moved = path.join(__dirname, '..', 'data', 'public', req.file.filename);
    fs.renameSync(req.file.path, path_moved);
    fs.stat(path_moved, (err, stats) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to get file size' , err});
        };
        let file_size = stats.size / (1024 * 1024); //? size in bytes to size in Megabytes
        let pu_file = new Public_files({
            path: path_moved,
            name: req.file.filename,
            size: file_size,
            owner: req.body.user_name,
        });
        pu_file.save()
        .then(() => res.status(201).json({ message: 'Successfully uploaded the file in Public' }))
        .catch(error => res.status(500).json({ message: 'Error when save in database', error }));
    });
};

exports.upload_some_public_files = (req, res) => { //TODO/ c'est juste un ^c ^v de upload multi prv files
    if(req.body.categorie !== "public"){
      return res.status(400).json({ message: "Request for a private file and it is a public file" });
    };
    if (!req.body.user_name || !req.file){
      return res.status(400).json({ message: 'Missing file or data_name'});
    };
    for(let i = 0; i < req.file.length; i++){
        let path_moved = path.join(__dirname, '..', 'data', 'public', req.file[i].filename);
        fs.renameSync(req.file[i].path, path_moved);
        fs.stat(path_moved, (err, stats) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to get file size' , err});
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
            .catch(error => res.status(500).json({ message: 'Error when save a file in database', error }));
        });
    };
    if(save_count_of_pubFile < req.file.length){
        return res.status(500).json({ message: 'Error when save a file in database', error });
    };
    res.status(201).json({ message: 'Successfully uploaded the file in Public' })
};
  