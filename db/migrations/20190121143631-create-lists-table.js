'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'Lists',
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
        group_id_prefix: {
          type: Sequelize.STRING(10),
          allowNull: false,
          unique: true
        },
        user_form_enabled: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        user_form_color: {
          type: Sequelize.STRING(10),
          allowNull: false,
          defaultValue: '#ffccff'
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
    return queryInterface.dropTable('Lists');
  }
};
