const Sequelize = require('sequelize');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config(); //LOAD CONFIG

const sequelize = new Sequelize( process.env.DATABASE,
process.env.DB_USER, process.env.DB_PASSWORD,{
    host: process.env.DB_HOST,
    dialect: 'mysql',
    timezone: '+09:00', //한국 시간 셋팅
    operatorsAliases: Sequelize.Op,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    //logging : false          //로그 출력 여부 (Default: true)
});

let db = [];

fs.readdirSync(__dirname)
    .filter(file => {
        return file.indexOf('.js')&& file !== 'index.js'
    })
    .forEach(file => {
        let model = sequelize.import(path.join(__dirname,
            file));
            db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if("associate" in db[modelName]){
        db[modelName].associate(db);
    }
});

//지도 좌표 저장 시 sequelize에서 point 타입으로 저장할 때 자동 호출되는 함수(ST_GeomFromText)에 대한 처리
const Wkt = require('terraformer-wkt-parser')
Sequelize.GEOMETRY.prototype._stringify = function _stringify(value, options) {
  return 'ST_GeomFromText(' + options.escape(Wkt.convert(value)) + ')'
}
Sequelize.GEOGRAPHY.prototype._stringify = function _stringify(value, options) {
  return 'ST_GeomFromText(' + options.escape(Wkt.convert(value)) + ')'
}


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;