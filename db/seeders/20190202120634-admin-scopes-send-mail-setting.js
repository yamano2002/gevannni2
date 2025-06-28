'use strict';

const adminScopes = require('../../enums/adminScopes').default;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert(
        'AdminScopes',
        [
          {
            id: 6,
            name: adminScopes.SEND_MAIL_SETTING
          }
        ],
        {}
      ),
      queryInterface.bulkInsert(
        'AdminUserAdminScopes',
        [
          {
            id: 7,
            AdminUserId: 1, // komabayuki
            AdminScopeId: 6 // send-mail-setting
          },
          {
            id: 8,
            AdminUserId: 2, // gkuc
            AdminScopeId: 6 // send-mail-setting
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
        { id: { [Op.or]: [7, 8] } },
        {}
      ),
      queryInterface.bulkDelete('AdminScopes', { id: 6 }, {})
    ]);
  }
};
