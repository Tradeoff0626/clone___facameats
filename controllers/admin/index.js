const { Router } = require('express');
const router = Router();
const ctrl = require('./admin.ctrl');

//middleware 추가 설정
const upload = require('../../middleware/multer');          //파일업로드(multer)
const csrfProtection = require('../../middleware/csrf');    //CSRF 


router.get('/shops', ctrl.get_shops );

router.get('/shops/write', csrfProtection, ctrl.get_shops_write );      //상점 정보 입력 화면에 CSRF 미들웨어 적용.(보내는 쪽)

router.post('/shops/write', upload.single('thumbnail'), csrfProtection, ctrl.post_shops_write );        //파일업로드 미들웨어 . single(단일파일)/array(멀티파일)
                                                                                                        //입력 CSRF 확인용으로 미들웨어 적용(받는 쪽). multer와 같이 사용하는 경우 뒤에 적용.

router.get('/shops/detail/:id', ctrl.get_shops_detail );

router.get('/shops/edit/:id', csrfProtection, ctrl.get_shops_edit );    //상점 정보 수정 화면에 CSRF 미들웨어 적용.(보내는 쪽)

router.post('/shops/edit/:id', upload.single('thumbnail'), csrfProtection, ctrl.post_shops_edit );  //수정 CSRF 확인용으로 미들웨어 적용(받는 쪽)

router.get('/shops/delete/:id', ctrl.get_shops_delete );

//메뉴 작성
router.post('/shops/detail/:id', ctrl.add_menu );

//메뉴 삭제
router.get('/shops/delete/:shop_id/:menu_id', ctrl.remove_menu );



module.exports = router;
