'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'AdminUserAdminScopes',
      [
        {
          id: 17,
          AdminUserId: 1, // gonohamachan
          AdminScopeId: 11 // sent-mail-history
        },
        {
          id: 18,
          AdminUserId: 2, // komabayuki
          AdminScopeId: 11 // sent-mail-history
        },
        {
          id: 19,
          AdminUserId: 3, // gkjim
          AdminScopeId: 12 // sent-mail-history-inf
        },
        {
          id: 20,
          AdminUserId: 4, // gkuc
          AdminScopeId: 12 // sent-mail-history-inf
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      'AdminUserAdminScopes',
      { id: { [Op.or]: [17, 18, 19, 20] } },
      {}
    );
  }
};
