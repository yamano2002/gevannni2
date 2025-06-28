'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'Buildings',
      {
        id: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
        },
        name: {
          type: Sequelize.STRING(100),
          allowNull: false,
          unique: true
        },
        tag: {
          type: Sequelize.STRING(50),
          allowNull: false,
          unique: true
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false
        }
      },
      {
        charset: 'utf8'
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Buildings');
  }
};
