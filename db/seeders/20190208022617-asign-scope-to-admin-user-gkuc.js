'use strict';

const adminScopes = require('../../enums/adminScopes').default;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'AdminUserAdminScopes',
      [
        {
          id: 14,
          AdminUserId: 4, // gkuc
          AdminScopeId: 9 // group-inf
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('AdminUserAdminScopes', { id: 14 }, {});
  }
};
