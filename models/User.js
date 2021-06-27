const passwordHash = require('../helpers/passwordHash');

module.exports = function(sequelize, DataTypes){
  const User = sequelize.define('User',
      {
          id: { 
              type: DataTypes.BIGINT.UNSIGNED, 
              primaryKey: true, 
              autoIncrement: true },
          username : { 
              type: DataTypes.STRING,
              validate : {      
                  len : [0, 50]             //Min Length:0, Max Length:50
              },
              allowNull : false             //not nu;;
          },
          
          password : { 
              type: DataTypes.STRING,
              validate : {
                  len : [3, 100]
              } ,
              allowNull : false
          },
          
          displayname : { type: DataTypes.STRING }

      },{
          tableName: 'User'
      }
  );

  //ManyToMany
  User.associate = (models) => {
    
    // 즐겨찾기(좋아요) 구현
    User.belongsToMany(models.Shops,{
        through: {
            model: 'LikesShops',
            unique: false
        },
        as: 'Likes',
        foreignKey: 'user_id',
        sourceKey: 'id',
        constraints: false
    });
  };

  //Sequelize Hooks.<https://sequelize.org/master/manual/hooks.html>  [Create(DB 입력) 전 처리. password 암호화]
  User.beforeCreate(( user, _ ) => {
      user.password = passwordHash(user.password);
  });

  return User;
}