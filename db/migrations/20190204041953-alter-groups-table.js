'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Groups', 'firstRegisteredAt', {
      type: Sequelize.DATE,
      allowNull: false,
      after: 'deletedAt'
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Groups', 'firstRegisteredAt');
  }
};
