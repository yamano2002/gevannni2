const fastify = require('../../../../../backend/bootstrap')();
const adminUserUtil = require('../../../../test-utilities/adminUser');
const userUtil = require('../../../../test-utilities/user');

async function tokenCheckRequest(accessToken) {
  return await fastify.inject({
    method: 'POST',
    url: '/adm/access_token/check',
    payload: {
      access_token: accessToken
    }
  });
}

describe('backend route /admin/access_token/check', () => {
  afterEach(async () => {
    await adminUserUtil.clear();
  });

  test('success', async () => {
    const username = 'test-user';
    const password = 'test-passw00d';
    const scopes = ['test-scope-1'];

    await adminUserUtil.create(username, password, scopes);

    const accessToken = await adminUserUtil.getAccessToken(username, password);

    const res = await tokenCheckRequest(accessToken);
    expect(res.statusCode).toBe(200);
    const resBody = JSON.parse(res.payload);
    expect(resBody).toHaveProperty('username', username);
    expect(resBody).toHaveProperty('scopes', scopes);
  });

  test('failure', async () => {
    const res = await tokenCheckRequest('invalid_token');
    expect(res.statusCode).toBe(401);
  });

  test('failure (using non-admin User access token)', async () => {
    const username = 'test-user';
    const password = 'test-passw00d';

    // create non-admin user
    await userUtil.create(username, password);

    // obtain non-admin user access token
    const accessToken = await userUtil.getAccessToken(username, password);

    const res = await tokenCheckRequest(accessToken);
    expect(res.statusCode).toBe(401);

    // clear user data
    await userUtil.clear();
  });
});
