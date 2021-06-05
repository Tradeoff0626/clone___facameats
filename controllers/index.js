const { Router } = require('express');
const router = Router()

router.use('/admin', require('./admin'));
router.use('/accounts', require('./accounts'));   //계정 컨트롤러 추가

module.exports = router;