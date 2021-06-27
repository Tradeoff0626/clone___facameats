const { Router } = require('express');
const router = Router();
const models = require('../../models');


router.get('/', async ( req, res ) => {
    
    try{
        const shops = await models.Shops.findAll({
    
          //삼항 연산자 및 스프레드 연산자 적용. 파라미터로 경도, 위도가 있는 경우만 속성 적용
          ...( req.query.lat && req.query.lng ?           
          {
            attributes: {
    
              include : [
                [ 
                    //literal()은 내용 그대로 쿼리를 적용함. sql injection 주의
                    //'ST_DISTANCE_SPHERE()'는 mySQL 지원 함수. 가까운 거리에 있는 대상을 찾음
                    models.sequelize.literal(`
                        ST_DISTANCE_SPHERE( POINT( 
                            ${req.query.lng}, 
                            ${req.query.lat} 
                        ), geo)`
                        ) ,
                        'distance'
                ]
              ]
    
    
            },
            
            order  : [ [ models.sequelize.literal('distance'), 'asc' ] ]
              
          }
    
          : '')
        });
        res.render('home.html', { shops });    
      }catch(e){
        console.log(e);
      }

});


module.exports = router;