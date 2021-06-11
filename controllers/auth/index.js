const { Router } = require('express');
const router = Router();

const passport = require('../../middleware/passport-facebook');


router.get('/facebook', passport.authenticate('facebook', {scope : 'email'}));

//주의* 로컬 테스트시 https로 반환되는데 SSL이 적용되어 있지 않으므로, 
//페이스북 로그인 후 브라우저에서 반환된 URL에서 'https://~' 를 'http://~'로 수정하여 브라우저 검색 필요.

//인증 후 페이스북에서 이 주소를 리턴해줌. 상단에 적은 callbackURL과 일치해야함.
router.get('/facebook/callback',
    passport.authenticate('facebook',
        {
            successRedirect : '/',                      //'/auth/facebook/success',
            failureRedirect : '/auth/facebook/fail'
        }
    )
);

router.get('/facebook/success', (req, res) => {
    res.send(req.user);
});

router.get('/facebook/fail', ( _ , res) => {
    res.send('facebook login fail');
});


module.exports = router;