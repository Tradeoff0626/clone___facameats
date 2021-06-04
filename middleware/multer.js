//썸네일 파일 업로드 기능 미들웨어
const path = require('path');
const uploadDir = path.join(__dirname, '../uploads');

//multer 셋팅
const multer = require('multer');       //npm install multer


var storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, uploadDir);
    },
    filename: function (req, file, callback) {
        callback(null, 'shops-' + Date.now() + '.' + file.mimetype.split('/')[1]);
    }
  })
  

module.exports = multer({ storage: storage });