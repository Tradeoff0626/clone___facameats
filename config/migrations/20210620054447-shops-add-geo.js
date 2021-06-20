'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     return queryInterface.addColumn('Shops', 'geo', {
      type: Sequelize.DataTypes.GEOMETRY('POINT'),    //Shops(상점) 테이블에 지도 좌표 컬럼 추가
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     return queryInterface.removeColumn('Shops', 'geo');
  }
};
