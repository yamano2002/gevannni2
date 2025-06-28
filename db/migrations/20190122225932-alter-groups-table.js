'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      // add `id_pub` column with Index (non Unique)
      await queryInterface.addColumn('Groups', 'id_pub', {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        after: 'ListId'
      }),
      await queryInterface.addIndex('Groups', ['id_pub']),

      // remove Unique constraint from `name` and `name_kana`
      await queryInterface.removeIndex('Groups', 'name'),
      await queryInterface.removeIndex('Groups', 'name_kana'),

      // add Index to `name` (non Unique)
      await queryInterface.addIndex('Groups', ['name'])
    ];
  },

  down: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.removeIndex('Groups', 'groups_name'),
      await queryInterface.addIndex('Groups', ['name_kana'], {
        name: 'name_kana',
        unique: true
      }),
      await queryInterface.addIndex('Groups', ['name'], {
        name: 'name',
        unique: true
      }),
      await queryInterface.removeColumn('Groups', 'id_pub')
    ];
  }
};
