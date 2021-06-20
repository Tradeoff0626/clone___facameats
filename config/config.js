
/*{
  "development": {
    "username": "root",
    "password": null,
    "database": "database_development",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}*/

//기존에 사용하던 .env 파일을 참조하도록 수정

require('dotenv').config();
const env = process.env;

const development = {
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DATABASE,
  host: env.DB_HOST,
  dialect: env.DB_DIALECT
};

const production = {
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DATABASE,
  host: env.DB_HOST,
  dialect: env.DB_DIALECT
};

const test = {
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DATABASE,
  host: env.DB_HOST,
  dialect: env.DB_DIALECT
};

module.exports = { development, production, test };

