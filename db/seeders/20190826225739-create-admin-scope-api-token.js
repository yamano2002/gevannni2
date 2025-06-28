'use strict';

const adminScopes = require('../../enums/adminScopes').default;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'AdminScopes',
      [
        {
          id: 13,
          name: adminScopes.API_TOKEN
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      'AdminScopes',
      { id: { [Op.or]: [13] } },
      {}
    );
  }
};
