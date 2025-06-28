'use strict';

const adminScopes = require('../../enums/adminScopes').default;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert(
        'AdminScopes',
        [
          {
            id: 7,
            name: adminScopes.MAIL_TEMPLATE
          }
        ],
        {}
      ),
      queryInterface.bulkInsert(
        'AdminUserAdminScopes',
        [
          {
            id: 9,
            AdminUserId: 1, // komabayuki
            AdminScopeId: 7 // mail-template
          },
          {
            id: 10,
            AdminUserId: 2, // gkuc
            AdminScopeId: 7 // send-mail-setting
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
        { id: { [Op.or]: [9, 10] } },
        {}
      ),
      queryInterface.bulkDelete('AdminScopes', { id: 7 }, {})
    ]);
  }
};
