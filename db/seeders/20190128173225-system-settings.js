'use strict';

const SYSTEM_SETTING_KEY = require('../../enums/systemSettingKey');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'SystemSettings',
      [
        {
          id: 1,
          key: SYSTEM_SETTING_KEY.MAINTENANCE_MODE,
          value: JSON.stringify(false),
          comment: 'メンテナンス中かどうか'
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('SystemSettings', null, {});
  }
};
