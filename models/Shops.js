const moment = require('moment');
const ShopsMenu = require('./ShopsMenu');

module.exports = (sequelize, DataTypes) => {
    const Shops = sequelize.define('Shops',
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            name : { type: DataTypes.STRING , comment: '상점명' },
            address : { type: DataTypes.STRING , comment: '주소' },
            location : { type: DataTypes.STRING , comment: '상세주소' },
            phone : { type: DataTypes.STRING , comment: '전화번호' },
            open_time : { type: DataTypes.STRING , comment: '운영시간' },
            cell_phone : { type: DataTypes.STRING , comment: '핸드폰번호' }
        }
    );

    Shops.associate = models => {

        Shops.hasMany ( models.ShopsMenu, {
            as          : 'Menu',           //ShopsMenu를 Menu로 지칭
            foreignKey  : 'shop_id',        //ShopsMenu 모델에 외래키 shop_id를 추가. (ShopsMenu 모델에는 shop_id가 업음)
            sourceKey   : 'id',             //Shops 모델의 id를 위 shop_id에 외부키를 설정한다.
            onDelete    : 'CASCADE'         //id에 해당하는 Shops row를 삭제하면 해당 외래키를 사용되느 ShopsMenu의 row를 삭제 
        });
    };

    Shops.prototype.dateFormat = (date) => (
        moment(date).format('YYYY-MM-DD')
    );

    return Shops;
}