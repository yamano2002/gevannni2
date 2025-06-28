'use strict';

const passwordSrv = require('../../services/passwordService');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'AdminUsers',
      [
        {
          id: 4,
          name: 'gkuc',
          password_hashed: await passwordSrv.genHash('1234abcd')
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('AdminUsers', { id: 4 }, {});
  }
};
