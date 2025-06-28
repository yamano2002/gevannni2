'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'SystemSettings',
      {
        id: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
        },
        key: {
          type: Sequelize.STRING(50),
          allowNull: false,
          unique: true
        },
        value: {
          type: Sequelize.BLOB,
          allowNull: true
        },
        comment: {
          type: Sequelize.TEXT,
          allowNull: true
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
    return queryInterface.dropTable('SystemSettings');
  }
};
