const models = require('../../models');

exports.get_likes = async( req , res ) => {
  
  const user = await models.User.findOne({
    where : {
      id : req.user.id
    },
    include : [ 'Likes' ]
  });
  
  //user.dataValues.Likes -> user 결과의 Likes 값(shops의 리스트)만 전달 하기 위해서...
  res.render('mypage/likes.html', { shops : user.dataValues.Likes });

};