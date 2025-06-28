'use strict';

const adminScopes = require('../../enums/adminScopes').default;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert(
        'AdminScopes',
        [
          {
            id: 5,
            name: adminScopes.USER
          }
        ],
        {}
      ),
      queryInterface.bulkInsert(
        'AdminUserAdminScopes',
        [
          {
            id: 6,
            AdminUserId: 1, // komabayuki
            AdminScopeId: 5 // user
          }
        ],
        {}
      )
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkDelete('AdminUserAdminScopes', { id: 6 }, {}),
      queryInterface.bulkDelete('AdminScopes', { id: 5 }, {})
    ]);
  }
};
