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


exports.get_login = ( req , res ) => {
  res.render('accounts/login.html', { flashMessage : req.flash().error });      //flash 메시지 반환(유저에서 조회되지 않은 경우 message 값)
}

exports.post_login = ( _ , res) => {
    res.send('<script>alert("로그인 성공"); \
    location.href="/accounts/success";</script>');
}

exports.get_success = ( req , res ) => {
    res.send(req.user);                     //로그인 성공 시 user값 출력. user는 로그인 성공 시 session 값으로 접근 가능. (req.session.passport.user -> req.user)
}
  
exports.get_logout = ( req , res ) => {
    req.logout();
    res.redirect('/accounts/login');
}