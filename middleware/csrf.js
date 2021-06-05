//csrf 설정. npm install csurf
const csrf = require('csurf');

module.exports = csrf({ cookie : true });