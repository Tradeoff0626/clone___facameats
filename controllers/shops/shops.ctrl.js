const models = require('../../models');

exports.get_shops_detail = async (req, res) => {

    try {

        const shop = await models.Shops.findOne({
            where : { id : req.params.id },
            include : [ 'Menu' ]
        });

        let cartList = {};
        let cartLength = 0;                 //장바구니에 담긴 메뉴의 개수

        if( typeof(req.cookies.cartList) !== 'undefined' ){         //request 의 cookie로 쿠키 정보 접근 가능
            cartList = JSON.parse(unescape(req.cookies.cartList));
            cartLength = Object.keys(cartList).length;              //배열이 아닌 오브젝트의 갯수는 이와 같이 사용함
        }
    
        res.render('shops/detail.html', {shop, cartLength});
            
    } catch (e) {
        console.log(e);
    }
    
}