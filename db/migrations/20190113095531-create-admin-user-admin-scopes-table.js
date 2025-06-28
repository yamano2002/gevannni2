'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.createTable(
        'AdminUserAdminScopes',
        {
          id: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
          },
          AdminUserId: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
              model: 'AdminUsers',
              key: 'id'
            },
            onDelete: 'CASCADE'
          },
          AdminScopeId: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
              model: 'AdminScopes',
              key: 'id'
            },
            onDelete: 'CASCADE'
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
      ),
      await queryInterface.addIndex(
        'AdminUserAdminScopes',
        ['AdminUserId', 'AdminScopeId'],
        {
          indexName: 'UQ_admin_user_id_admin_scope_id',
          indicesType: 'UNIQUE'
        }
      )
    ];
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('AdminUserAdminScopes');
  }
};
