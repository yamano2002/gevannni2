'use strict';

const adminScopes = require('../../enums/adminScopes').default;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert(
        'AdminScopes',
        [
          {
            id: 1,
            name: adminScopes.SETTINGS
          },
          {
            id: 2,
            name: adminScopes.OBTAIN_USER_LIST
          },
          {
            id: 3,
            name: adminScopes.CHANGE_PSWD
          }
        ],
        {}
      ),
      queryInterface.bulkInsert(
        'AdminUserAdminScopes',
        [
          {
            id: 1,
            AdminUserId: 1, // komabayuki
            AdminScopeId: 1 // settings
          },
          {
            id: 2,
            AdminUserId: 1, // komabayuki
            AdminScopeId: 2 // obtain-user-list
          },
          {
            id: 3,
            AdminUserId: 1, // komabayuki
            AdminScopeId: 3 // change-password
          }
        ],
        {}
      )
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkDelete('AdminUserAdminScopes', null, {}),
      queryInterface.bulkDelete('AdminScopes', null, {})
    ]);
  }
};
