'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Groups', 'name_kana', {
      type: Sequelize.STRING(255),
      allowNull: true
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Groups', 'name_kana', {
      type: Sequelize.STRING(255),
      allowNull: false
    });
  }
};
