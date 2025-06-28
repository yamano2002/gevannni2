const models = require('../../db/models');
const adminUser = require('../test-utilities/adminUser');
const execSync = require('child_process').execSync;

const user1 = 'user1';
const password = 'pasw00d';

describe('changeamdinpswd', () => {
  beforeEach(async () => {
    // create test admin user
    await adminUser.create(user1, password, []);
  });

  afterEach(async () => {
    await adminUser.clear();
  });

  test('success', async () => {
    execSync('node ./commands/change-admin-pswd user1 new_passw00d');

    const afterchange = await models.AdminUser.findOne({
      where: { name: user1 },
      attributes: ['password_hashed']
    });

    const isEqual = await afterchange.verifyPassword('new_passw00d');
    expect(isEqual).toBe(true);
  });
});
