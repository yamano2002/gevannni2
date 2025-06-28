'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'MailTemplates',
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
        description: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        has_sign: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },
        from_address_name: {
          type: Sequelize.STRING(50),
          allowNull: true
        },
        from_address_local_part: {
          type: Sequelize.STRING(30),
          allowNull: true
        },
        reply_to: {
          type: Sequelize.STRING(255),
          allowNull: true
        },
        subject: {
          type: Sequelize.STRING(70),
          allowNull: false
        },
        body: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        variables: {
          type: Sequelize.BLOB,
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
    return queryInterface.dropTable('MailTemplates');
  }
};
