const { Router } = require('express');
const { render } = require('nunjucks');
const router = Router();

router.get('/', (req, res) => {
    let totalAmount = 0;
    let cartList = {};

    if( typeof(req.cookies.cartList) !== 'undefined' ){         //request 의 cookie로 쿠키 정보 접근 가능
        cartList = JSON.parse(unescape(req.cookies.cartList));

        for(const key in cartList){
            totalAmount += parseInt(cartList[key].price);       //cartList의 JSON key 값을 이하여 price값 합산
        }
    }

    res.render('cart/index.html', {cartList, totalAmount});

});

module.exports = router;