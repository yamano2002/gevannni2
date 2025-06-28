const fastify = require('../../../../../backend/bootstrap')();
const models = require('../../../../../db/models');
const scopes = require('../../../../../enums/adminScopes').default;
const adminUser = require('../../../../test-utilities/adminUser');

const user1 = 'user1';
const password = 'pasw00d';

describe('backend route /admin/list/list', () => {
  beforeEach(async () => {
    // create test list
    await models.User.create({
      name: 'testuser',
      password: 'testpassword'
    });
  });

  afterEach(async () => {
    await adminUser.clear();
    await models.User.destroy({ where: {} });
  });

  test('success', async () => {
    // create admin user with scope
    await adminUser.create(user1, password, [scopes.USER]);

    const accessToken = await adminUser.getAccessToken(user1, password);

    const userListRes = await fastify.inject({
      method: 'GET',
      url: '/adm/user',
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });
    expect(userListRes.statusCode).toBe(200);
    const res = JSON.parse(userListRes.payload);
    expect(res.length).toBe(1);
    expect(res[0].name).toBe('testuser');
  });

  test('failure (missing scope)', async () => {
    // create admin user without scope
    await adminUser.create(user1, password, []);

    const accessToken = await adminUser.getAccessToken(user1, password);

    const userListRes = await fastify.inject({
      method: 'GET',
      url: '/adm/user',
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });
    expect(userListRes.statusCode).toBe(403);
  });
});
