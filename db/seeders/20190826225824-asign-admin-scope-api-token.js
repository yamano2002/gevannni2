'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'AdminUserAdminScopes',
      [
        {
          id: 21,
          AdminUserId: 1, // gonohamachan
          AdminScopeId: 13 // api-token
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      'AdminUserAdminScopes',
      { id: { [Op.or]: [21] } },
      {}
    );
  }
};
