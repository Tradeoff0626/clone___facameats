const { Router } = require('express');
const router = Router();
const ctrl = require('./shops.ctrl');
const loginRequired = require('../../middleware/loginRequired');

router.get('/:id(\\d+)', ctrl.get_shops_detail);  ///':id(\\d+)' <정규표현식으로> 10진 정수만 id로 설정하였을 때 호출됨

//즐겨찾기(좋아요) 처리 <로그인 필요>
router.post('/like/:shop_id(\\d+)', loginRequired, ctrl.post_shops_like);
router.delete('/like/:shop_id(\\d+)', loginRequired ,ctrl.delete_shops_like);


module.exports = router;