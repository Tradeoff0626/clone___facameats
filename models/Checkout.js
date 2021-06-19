const moment = require('moment');

module.exports = function(sequelize, DataTypes){
    const Checkout = sequelize.define('Checkout',
        {
            id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
            imp_uid : { type: DataTypes.STRING },           //고유ID (iamport 데이터)
            merchant_uid : { type: DataTypes.STRING },      //상점 거래ID (iamport 데이터)
            paid_amount : { type: DataTypes.INTEGER },      //결제금액 (iamport 데이터)
            apply_num : { type: DataTypes.STRING },         //카드사 승인번호

            buyer_email : { type: DataTypes.STRING },       //이메일 (구매정보 입력폼)
            buyer_name : { type: DataTypes.STRING },        //구매자 성함 (구매정보 입력폼)
            buyer_tel : { type: DataTypes.STRING },         //전화번호 (구매정보 입력폼)
            buyer_addr : { type: DataTypes.STRING },        //구매자 주소 (구매정보 입력폼)

            buyer_postcode : { type: DataTypes.STRING },    //우편번호 (구매정보 입력폼)

            status : { type: DataTypes.STRING },            //결재완료, 배송중 등등

        },{
            tableName: 'Checkout'
        }
    );

    //Many To Many. 교차 테이블 생성됨 (/models/ShopsMenu.js 와 교차)
    Checkout.associate = (models) => {
      Checkout.belongsToMany( models.ShopsMenu,{    //Checkout에서 ShopsMenu을 ManyToMany하여 두 테이블의 키 값을 가짐
          through: {
            model: 'CheckoutMenu',         //교차 테이블명.
            unique: false
          },
          as : 'Menu',                                  
          foreignKey: 'checkout_id',
          sourceKey: 'id',
          constraints: false
      });


      //Shops에서 Checkout으로 OneToOne 되도록 설정하였지만, Checkout에서 Shops로 접근하기 위해서는 추가로 설정해야함. 
      Checkout.belongsTo(
            models.Shops, 
            { as :'Shop',  foreignKey: 'shop_id', targetKey: 'id'} 
        );
    };


    // 년-월-일
    Checkout.prototype.dateFormat = (date) => (
        moment(date).format('YYYY-MM-DD // h:mm')
    );

    return Checkout;
}