'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'AdminUserAdminScopes',
      [
        {
          id: 15,
          AdminUserId: 1, // gonohamachan
          AdminScopeId: 10 // mail
        },
        {
          id: 16,
          AdminUserId: 2, // komabayuki
          AdminScopeId: 10 // mail
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      'AdminUserAdminScopes',
      { id: { [Op.or]: [15, 16] } },
      {}
    );
  }
};
