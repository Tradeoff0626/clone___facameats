const models = require('../../models');

exports.get_shops = async ( req , res ) => {

    const paginate = require('express-paginate'); 

    try{

        const [ shops, totalCount ] = await Promise.all([
            await models.Shops.findAll({
                limit   : req.query.limit,          //paginate.middleware()의 첫번재 인자. 한 페이지에 표시될 갯수. limit. (여기서는 '2')
                offset  : req.offset,               //오프셋
                order   : [ ['createdAt', 'desc'] ] //정렬
            }), 
            await models.Shops.count()              //게시물 총 갯수
        ]);

        const pageCount = Math.ceil( totalCount / req.query.limit );
		const pages = paginate.getArrayPages(req)( 5 , pageCount, req.query.page);  //첫번째 인자는 페이지네이션에 보여질 페이지 수 (5면 << 6 7 8 9 10 >>)
			
		res.render( 'admin/shops.html' , { shops , pages , pageCount });

    }catch(e){
        console.log(e);
    }

}

exports.get_shops_write = ( req , res ) => {
  res.render( 'admin/form.html', { csrfToken : req.csrfToken() } );     //입력 화면 렌더링 시, 임의 토큰 값 생성 후 적용
}

exports.post_shops_write = async (req,res) => {

    try{

        //지도 위치 좌표(경도,위도)
        req.body.geo = {
            type        : 'Point',
            coordinates : [
                req.body.geo.split(',')[0],
                req.body.geo.split(',')[1]
            ]
        }

        //console.log(req.file);
        req.body.thumbnail = (req.file) ? req.file.filename : '';       //입력할 썸네일이 없다면 빈 경로를 설정.
		await models.Shops.create(req.body);
        res.redirect('/admin/shops');

    }catch(e){
        console.log(e);
    }
};

exports.get_shops_detail = async(req, res) => {

    try{

	//const shop = await models.Shops.findByPk(req.params.id);      //Shops 정보만 조회
    const shop = await models.Shops.findOne( {                      //ShopsMenu도 같이 조회
        where : {
            id : req.params.id
        },
        include : [                                                 
            'Menu'                                                  //Shops.js의 Shops.associate()에서 as 로 설정한 값. 템플릿에서 'shop.Menu'로 접근 가능.
        ]
    })

      res.render('admin/detail.html', { shop });  

    }catch(e){
        console.log(e);
    }


}


exports.get_shops_edit = async(req, res) => {

    try{

        //태그 정보도 조회되도록 변경
        //const shop = await models.Shops.findByPk(req.params.id);
        const shop = await models.Shops.findOne({
            where : { id : req.params.id},
            include : [ 
                { model : models.Tag, as : 'Tag' }
            ],
            order: [        //태그 정렬
                [ 'Tag', 'createdAt', 'desc' ]
            ]
        });
        res.render('admin/form.html', { shop, csrfToken : req.csrfToken() });  //수정 화면 렌더링 시, 임의 토큰 값 생성 후 추가 적용

    }catch(e){
        console.log(e);
    }


}

exports.post_shops_edit = async(req, res) => {

    const fs = require('fs');
    const path = require('path');
    const uploadDir = path.join(__dirname, '../../uploads');

    try{

        //지도 위치 좌표(경도,위도)
        req.body.geo = {
            type        : 'Point',
            coordinates : [
                req.body.geo.split(',')[0],
                req.body.geo.split(',')[1]
            ]
        }

        const shop = await models.Shops.findByPk(req.params.id);

        if(req.file && shop.thumbnail) {            //썸네일. 변경하려는 파일과 기존 파일이 있는 경우
            fs.unlinkSync(uploadDir + '/' + shop.thumbnail);
        }

        req.body.thumbnail = (req.file) ? req.file.filename : shop.thumbnail;   //변경할 파일이 없으면 기존파일명 그대로 사용

        await models.Shops.update(
            req.body , 
            { 
                where : { id: req.params.id } 
            }
        );
        res.redirect('/admin/shops/detail/' + req.params.id );

    }catch(e){
        console.log(e);
    }

}

exports.get_shops_delete = async(req, res) => {

    try{

        await models.Shops.destroy({
            where: {
                id: req.params.id
            }
        });
        res.redirect('/admin/shops');

    }catch(e){
        console.log(e);
    }

}


//상점(Shops)의 메뉴(ShopsMenu) 추가
exports.add_menu = async(req, res) => {

    try {

        const shop = await models.Shops.findByPk(req.params.id);
        await shop.createMenu(req.body);                       //shopMenu의 Menu는 Shops.js의 Shops.associate()에서 as로 설정한 값. 
        res.redirect('/admin/shops/detail/' + req.params.id);
        
    } catch (e) {
        console.log(e);
    }

}


//상점(Shops)의 메뉴(ShopsMenu) 삭제
exports.remove_menu = async(req, res) => {

    try {

        await models.ShopsMenu.destroy({
            where : {
                id : req.params.menu_id
            }
        });

        res.redirect('/admin/shops/detail/' + req.params.shop_id);

    } catch (e) {
        console.log(e);
    }
}

exports.get_order = async( _ , res ) => {
    const checkouts = await models.Checkout.findAll();
    res.render('admin/order.html', { checkouts });
}
  

exports.get_order_edit = async(req,res) => {
    try{
  
        const checkout = await models.Checkout.findOne({
            where : {
                id : req.params.id
            },
            include : [ 'Menu' , 'Shop' ]       //메뉴들을 가져오지만 메뉴 리스트나 가격이 결제 시점과 다른 경우가 있으므로
        });                                     //결제 시점에서 따로 저장하고 여기서 조회하는 기능 추가 구현 필요
        res.render( 'admin/order_edit.html' , { checkout });
  
    }catch(e){
        console.log(e);
    }
  }


  exports.write_tag = async (req, res) => {
    try {
        const tag = await models.Tag.findOrCreate({
            where: {
                name : req.body.name
            }
        });

        const shop = await models.Shops.findByPk(req.body.shop_id);
        const status = await shop.addTag(tag[0]);

        res.json({
            status : status,
            tag : tag[0]
        })

    } catch (e) {
        res.json(e)
    }
}

exports.delete_tag = async (req, res) => {
    try {
        const shop = await models.Shops.findByPk(req.params.shop_id);
        const tag = await models.Tag.findByPk(req.params.tag_id);

        const result = await shop.removeTag(tag);
        
        res.json({
            result : result
        });
    } catch (e) {
        console.log(e);
    }
}