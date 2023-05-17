const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let path_uploads = path.join(__dirname, '..', 'data');
    cb(null, path_uploads);
  },

  filename: (req, file, cb) => {
    let data_file = file.originalname.split(' ').join('_');
    let indiv_name = Date.now() + '-' + data_file;
    cb(null, indiv_name);
  }
});

module.exports = multer({ storage: storage });
