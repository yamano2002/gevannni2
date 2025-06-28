'use strict';

const adminScopes = require('../../enums/adminScopes').default;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'AdminScopes',
      [
        {
          id: 10,
          name: adminScopes.MAIL
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('AdminScopes', { id: 10 }, {});
  }
};
