module.exports = (req, res, next ) => {
    if(!req.isAuthenticated())  {           //로그인 되어 있지 않은 경우
        res.redirect('/accounts/login');
    } else {
        next();
    }
        
}