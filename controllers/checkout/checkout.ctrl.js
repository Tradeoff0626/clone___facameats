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


//iamport 결제 처리를 개발자 모드와 같이 사용자가 볼수 있는 상황을 배제하기 위해 컨트롤러에서 처리하도록 개선
exports.get_complete = async (req, res) => {

    const dotenv = require('dotenv');
    dotenv.config(); //LOAD CONFIG

    // 모듈 선언
    const { Iamporter } = require('iamporter');
    const iamporter = new Iamporter({
        apiKey: process.env.IAMPORT_APIKEY ,
        secret: process.env.IAMPORT_SECRET
    });

    try{

        //iamport에서 결제 정보를 조회. 조회한 정보를 이용하여 아래에 DB로 저장하는 처리를 함. 
        const iamportData = await iamporter.findByImpUid(req.query.imp_uid);

        //iamport에서 결제 정보를 DB에 저장하는 처리
        const checkout = await models.Checkout.create({
            imp_uid : iamportData.data.imp_uid,
            merchant_uid : iamportData.data.merchant_uid,
            paid_amount : iamportData.data.amount,
            apply_num : iamportData.data.apply_num,
            
            buyer_email : iamportData.data.buyer_email,
            buyer_name : iamportData.data.buyer_name,
            buyer_tel : iamportData.data.buyer_tel,
            buyer_addr : iamportData.data.buyer_addr,
            buyer_postcode : iamportData.data.buyer_postcode,
            shop_id : req.query.shop_id,
            status : "결재완료",
        });

        const menuArray = JSON.parse(req.query.menuArray);

        //메뉴 저장 처리 함수 구현(중첩 try~catch 처리 구현. 외부로 예외 throw)
        async function asyncSetMenu(menu_id){
            try{
            const menu = await models.ShopsMenu.findByPk( menu_id );
            const status = await checkout.addMenu(menu);
            if(typeof status == 'undefined'){
                throw `menu :: ${menu_id}가 존재하지 않습니다.`;
            }
            }catch(e){
            throw e;
            }
        }

        //주문할 메뉴 수 만큼 저장 처리 함수 반복 수행. 함수안에서 try~catch 중복 처리를 하기 번거로우므로 함수로 구현.
        for (const menu_id of menuArray) await asyncSetMenu(menu_id);

        res.redirect('/checkout/success');


    }catch(e){
        console.log(e);
    }

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