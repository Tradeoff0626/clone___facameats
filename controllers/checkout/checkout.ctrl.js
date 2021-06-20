const models = require('../../models'); 

exports.index = (req, res) => {

    let totalAmount = 0;
    let cartList = {};
    let shop_id = 0;
    let menuArray = [];

    if( typeof(req.cookies.cartList) !== 'undefined' ){         //request 의 cookie로 쿠키 정보 접근 가능
        cartList = JSON.parse(unescape(req.cookies.cartList));

        for(const key in cartList){
            totalAmount += parseInt(cartList[key].price);       //cartList의 JSON key 값을 이하여 price값 합산
            shop_id = cartList[key].shop_id;
            menuArray.push(parseInt(key));
        }
    }
    
    res.render('checkout/index.html', {cartList, totalAmount, shop_id, menuArray});
};


exports.post_complete = async (req, res) => {

    try{
        //ManyToMany 저장 방식
        const checkout = await models.Checkout.create(req.body);
        const menuArray = JSON.parse(req.body.menuArray);           //메뉴ID 배열 JSON 파싱

        //메뉴 저장 처리 함수 구현(중첩 try~catch 처리 구현. 외부로 예외 throw)
        async function asyncSetMenu(menu_id){
            try{
                const menu = await models.ShopsMenu.findByPk( menu_id );
                const status = await checkout.addMenu(menu);            //Checkout에 Menu ID 저장 >>> add + ('Menu' alias)

                if(typeof status == 'undefined'){                       //없는 메뉴ID에 대한 예외 처리
                    throw `menu :: ${menu_id}가 존재하지 않습니다.`;     //없는 메뉴ID인 경우 예외 throw~
                }
            }catch(e){
                throw e;
            }
        }

        //주문할 메뉴 수 만큼 저장 처리 함수 반복 수행. 함수안에서 try~catch 중복 처리를 하기 번거로우므로 함수로 구현.
        for (const menu_id of menuArray) await asyncSetMenu(menu_id);

        res.json( {message:"success"} );
        
        }catch(e){
            console.log(e);
            res.status(400).json({message: e });
        }
};


exports.get_success = ( _ , res) => {
    res.render('checkout/success.html');
};