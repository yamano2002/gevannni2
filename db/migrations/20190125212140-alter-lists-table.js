'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Lists', 'user_form_color', {
      type: Sequelize.STRING(30),
      allowNull: false,
      defaultValue: 'rgb(255, 214, 255)'
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Lists', 'user_form_color', {
      type: Sequelize.STRING(10),
      allowNull: false,
      defaultValue: '#ffccff'
    });
  }
};
