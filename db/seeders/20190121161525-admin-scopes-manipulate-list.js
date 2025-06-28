'use strict';

const adminScopes = require('../../enums/adminScopes').default;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert(
        'AdminScopes',
        [
          {
            id: 4,
            name: adminScopes.LIST
          }
        ],
        {}
      ),
      queryInterface.bulkInsert(
        'AdminUserAdminScopes',
        [
          {
            id: 4,
            AdminUserId: 1, // komabayuki
            AdminScopeId: 4 // list
          },
          {
            id: 5,
            AdminUserId: 2, // komabayuki
            AdminScopeId: 4 // list
          }
        ],
        {}
      )
    ]);
  },

  down: (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return Promise.all([
      queryInterface.bulkDelete(
        'AdminUserAdminScopes',
        { id: { [Op.or]: [4, 5] } },
        {}
      ),
      queryInterface.bulkDelete('AdminScopes', { id: 4 }, {})
    ]);
  }
};
