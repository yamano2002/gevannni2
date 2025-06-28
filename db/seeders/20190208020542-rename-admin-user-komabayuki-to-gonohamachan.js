'use strict';

const models = require('../models');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return models.AdminUser.update(
      {
        name: 'gonohamachan'
      },
      {
        where: {
          name: 'komabayuki'
        }
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return models.AdminUser.update(
      {
        name: 'komabayuki'
      },
      {
        where: {
          name: 'gonohamachan'
        }
      }
    );
  }
};
