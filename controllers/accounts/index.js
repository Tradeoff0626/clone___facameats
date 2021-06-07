const { Router } = require('express');
const router = Router();
const ctrl = require('./accounts.ctrl');

const passport = require('../../middleware/passport-local');

//회원가입
router.get('/join', ctrl.get_join);

router.post('/join', ctrl.post_join);


//로그인
router.get('/login', ctrl.get_login);

//passport 로그인. 미들웨어 적용
router.post('/login' , 
    passport.authenticate('local', {            //미들웨어
        failureRedirect: '/accounts/login',     //실패 시 리다이렉트 
        failureFlash: true 
    }), 
    ctrl.post_login
);

router.get('/success', ctrl.get_success);

router.get('/logout', ctrl.get_logout);


module.exports = router;