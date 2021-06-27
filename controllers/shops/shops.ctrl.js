const models = require('../../models');

exports.get_shops_detail = async (req, res) => {

    try {

        const shop = await models.Shops.findOne({
            where : { id : req.params.id },
            include : [ 'Menu' ]
        });

        let cartList = {};
        let cartLength = 0;                 //장바구니에 담긴 메뉴의 개수
        let sameShops = true;               //주문한 메뉴가 동일한 가게 인지 확인하는 용도. 초기값은 무조건 메뉴등록 가능하므로 true        

        if( typeof(req.cookies.cartList) !== 'undefined' ){         //request 의 cookie로 쿠키 정보 접근 가능
            cartList = JSON.parse(unescape(req.cookies.cartList));
            cartLength = Object.keys(cartList).length;              //배열이 아닌 오브젝트의 갯수는 이와 같이 사용함

            //하나의 상점에서만 장바구니 기능을 사용하기 위한 처리
            for(let key in cartList){            
                if(cartList[key].shop_id !== parseInt(req.params.id))         //기존의 카드에 등록된 상점ID와 요청 상점 ID가 다를 경우
                    sameShops = false; 
            }
        }
    
        res.render('shops/detail.html', {shop, cartLength, sameShops});
            
    } catch (e) {
        console.log(e);
    }
    
};


exports.post_shops_like = async (req, res) => {

    try {
        const shop = await models.Shops.findByPk(req.params.shop_id);
        const user = await models.User.findByPk(req.user.id);
  
        const status = await user.addLikes(shop);   // (=) shop.addLikeUser(user);

        console.log(status);
        
        res.json({
            status              //이전에 좋아요 상태(값)에 따른 처리를 하기 위해서...
        })
    } catch (e) {
        console.log(e);
    }
  };

  
  exports.delete_shops_like = async (req, res) => {

    try {
        const shop = await models.Shops.findByPk(req.params.shop_id);
        const user = await models.User.findByPk(req.user.id);
    
        await user.removeLikes(shop);     // (=) shop.removeLikeUser(user);
        
        res.json({
                message : "success"
            });
    } catch (e) {
        console.log(e);
    }
  };
