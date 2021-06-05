const models = require('../../models');


exports.get_join = ( _ , res ) => {
  res.render('accounts/join.html');
}

exports.post_join = async ( req , res ) => {
    
    try {
        
        await models.User.create(req.body);     // >> beforeCreate() 호출됨
    
        res.send('<script>alert("회원가입이 완료되었습니다.");\
                    location.href="/accounts/login"</script>');

    } catch (e) {
        console.log(e);
    }
    
}


exports.get_login = ( _ , res ) => {
  res.render('accounts/login.html');
}