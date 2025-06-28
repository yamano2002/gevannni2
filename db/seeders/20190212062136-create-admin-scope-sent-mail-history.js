'use strict';

const adminScopes = require('../../enums/adminScopes').default;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'AdminScopes',
      [
        {
          id: 11,
          name: adminScopes.SENT_MAIL_HISTORY
        },
        {
          id: 12,
          name: adminScopes.SENT_MAIL_HISTORY_INF
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      'AdminScopes',
      { id: { [Op.or]: [11, 12] } },
      {}
    );
  }
};
