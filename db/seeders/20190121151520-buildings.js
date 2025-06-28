'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Buildings',
      [
        {
          id: 1,
          name: '学生会館本館',
          tag: 'gk-main'
        },
        {
          id: 2,
          name: '学生会館新館',
          tag: 'gk-new'
        },
        {
          id: 3,
          name: 'キャンパスプラザA棟',
          tag: 'cp-a'
        },
        {
          id: 4,
          name: 'キャンパスプラザB棟',
          tag: 'cp-b'
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Buildings', null, {});
  }
};
