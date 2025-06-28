'use strict';

const adminScopes = require('../../enums/adminScopes').default;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert(
        'AdminScopes',
        [
          {
            id: 8,
            name: adminScopes.GROUP
          },
          {
            id: 9,
            name: adminScopes.GROUP_INF
          }
        ],
        {}
      ),
      queryInterface.bulkInsert(
        'AdminUserAdminScopes',
        [
          {
            id: 11,
            AdminUserId: 1, // komabayuki
            AdminScopeId: 8 // group
          },
          {
            id: 12,
            AdminUserId: 2, // gkuc
            AdminScopeId: 8 // group
          },
          {
            id: 13,
            AdminUserId: 3, // gkjim
            AdminScopeId: 9 // group-inf
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
        { id: { [Op.or]: [11, 12, 13] } },
        {}
      ),
      queryInterface.bulkDelete('AdminScopes', { id: { [Op.or]: [8, 9] } }, {})
    ]);
  }
};
