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
    
    return ShopsMenu;
}