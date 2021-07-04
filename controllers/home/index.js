const { Router } = require('express');
const router = Router();
const models = require('../../models');


router.get('/', async ( req, res ) => {
    
    try{
        const shops = await models.Shops.findAll({

          include : [ 'Tag' ],
    
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
    
          : ''),

          where : {
              ...( 
              // 검색어가 있는 경우
              ('name' in req.query && req.query.name) ? 
              {
                  // + 태그에서 가져옴 or
                  [models.Sequelize.Op.or] : [      //or 조건(태그명 또는 상점명)... 배열 형식으로 나열함. 여기서는 태그 다음 상점이름
                      models.Sequelize.where( models.Sequelize.col('Tag.name') , {
                          [models.Sequelize.Op.like] : `%${req.query.name}%`        //태그명을 like 조건('% ~ %')으로 조회 
                      }),
                      {
                          'name' : {                                                //상점명을 like 조건('% ~ %')으로 조회
                              [models.Sequelize.Op.like] : `%${req.query.name}%`
                          }
                      }
                  ],
              }
              :
              '' ),
          }
        });
        res.render('home.html', { shops });    
      }catch(e){
        console.log(e);
      }

});


module.exports = router;