const { Router } = require('express');
const router = Router();
const ctrl = require('./accounts.ctrl');

//회원가입
router.get('/join', ctrl.get_join);

router.post('/join', ctrl.post_join);


//로그인
router.get('/login', ctrl.get_login);

module.exports = router;