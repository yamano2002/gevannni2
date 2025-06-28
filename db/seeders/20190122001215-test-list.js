'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Lists',
      [
        {
          name: 'テストリスト',
          tag: 'test',
          group_id_prefix: 'test'
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Lists', { name: 'テストリスト' }, {});
  }
};
