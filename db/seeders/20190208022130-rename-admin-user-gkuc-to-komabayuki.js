'use strict';

const models = require('../models');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return models.AdminUser.update(
      {
        name: 'komabayuki'
      },
      {
        where: {
          name: 'gkuc'
        }
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return models.AdminUser.update(
      {
        name: 'gkuc'
      },
      {
        where: {
          name: 'komabayuki'
        }
      }
    );
  }
};
