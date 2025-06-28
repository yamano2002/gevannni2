'use strict';

const passwordSrv = require('../../services/passwordService');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'AdminUsers',
      [
        {
          id: 1,
          name: 'komabayuki',
          password_hashed: await passwordSrv.genHash('1234abcd')
        },
        {
          id: 2,
          name: 'gkuc',
          password_hashed: await passwordSrv.genHash('1234abcd')
        },
        {
          id: 3,
          name: 'gkjim',
          password_hashed: await passwordSrv.genHash('1234abcd')
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('AdminUsers', null, {});
  }
};
