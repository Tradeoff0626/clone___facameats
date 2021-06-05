const crypto  = require('crypto');
const mysalt = 'kang';                  //암호화 처리 전 임의문자 추가. 암호화 권고 사항.

//패스워드 암호화
//입력 암호 + salt => sha512 => hash => base64인코딩
module.exports = (password) => {
    return crypto.createHash('sha512').update( password + mysalt ).digest('base64');
}