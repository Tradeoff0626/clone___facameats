module.exports = (sequelize, DataTypes) => {
    const ShopsMenu = sequelize.define('ShopsMenu',
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            name : { type: DataTypes.STRING , comment: '메뉴명' },
            price : { type: DataTypes.INTEGER , comment: '가격' }
        },{
            tableName: 'ShopsMenu'      //tableName을 지정하지 않으면 define의 첫번재 파라미터 + 's'로 자동 설정됨. (여기서는 shopsmenus)
        }
    );


    //Many To Many. 교차 테이블 생성됨 (/models/Checkout.js 와 교차)
    ShopsMenu.associate = (models) => {
        ShopsMenu.belongsToMany( models.Checkout ,{     //ShopsMenu에서 Checkout을 ManyToMany하여 두 테이블의 키 값을 가짐
            through: {
                model: 'CheckoutMenu',      //교차 테이블명
                unique: false
            },
            as : 'Checkout', 
            foreignKey: 'menu_id',
            sourceKey: 'id',
            constraints: false
        });
    }
    
    return ShopsMenu;
}