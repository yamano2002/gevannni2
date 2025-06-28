'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.createTable(
        'SentMailContents',
        {
          id: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
          },
          SentMailId: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
            unique: true
          },
          to: {
            type: Sequelize.TEXT,
            allowNull: true
          },
          subject: {
            type: Sequelize.TEXT,
            allowNull: true
          },
          body: {
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
          charset: 'utf8mb4',
          engine: 'Mroonga'
        }
      ),
      await queryInterface.addIndex('SentMailContents', {
        type: 'FULLTEXT',
        fields: ['to', 'subject', 'body']
      })
    ];
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('SentMailContents');
  }
};
