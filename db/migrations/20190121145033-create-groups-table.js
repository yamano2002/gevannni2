'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'Groups',
      {
        id: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
        },
        ListId: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'Lists',
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        name: {
          type: Sequelize.STRING(100),
          allowNull: false,
          unique: true
        },
        name_kana: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: true
        },
        BuildingId: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: true,
          references: {
            model: 'Buildings',
            key: 'id'
          }
        },
        charge_person_name: {
          type: Sequelize.STRING(100),
          allowNull: false
        },
        tel: {
          type: Sequelize.STRING(20),
          allowNull: false
        },
        mail_crypt: {
          type: Sequelize.STRING(1024),
          allowNull: false
        },
        deletedAt: {
          type: Sequelize.DATE,
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
    return queryInterface.dropTable('Groups');
  }
};
