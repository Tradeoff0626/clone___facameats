const { Router } = require('express');
const router = Router();
const ctrl = require('./shops.ctrl');

router.get('/:id(\\d+)', ctrl.get_shops_detail);  ///':id(\\d+)' <정규표현식으로> 10진 정수만 id로 설정하였을 때 호출됨


module.exports = router;