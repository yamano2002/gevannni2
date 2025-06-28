const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = async () => {
  /**
   * Database tear down
   */
  await exec('env NODE_ENV=test sequelize db:migrate');
};
