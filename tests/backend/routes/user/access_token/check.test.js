const fastify = require('../../../../../backend/bootstrap')();
const userUtil = require('../../../../test-utilities/user');
const adminUserUtil = require('../../../../test-utilities/adminUser');

async function tokenCheckRequest(accessToken) {
  return await fastify.inject({
    method: 'POST',
    url: '/access_token/check',
    payload: {
      access_token: accessToken
    }
  });
}

describe('backend route /access_token/check', () => {
  afterEach(async () => {
    await userUtil.clear();
  });

  test('success', async () => {
    const username = 'test-user';
    const password = 'test-passw00d';

    await userUtil.create(username, password);

    const accessToken = await userUtil.getAccessToken(username, password);

    const res = await tokenCheckRequest(accessToken);
    expect(res.statusCode).toBe(200);
    const resBody = JSON.parse(res.payload);
    expect(resBody).toHaveProperty('username', username);
  });

  test('failure', async () => {
    const res = await tokenCheckRequest('invalid_token');
    expect(res.statusCode).toBe(401);
  });

  test('success (using admin User access token)', async () => {
    const username = 'test-user';
    const password = 'test-passw00d';

    // create admin user
    await adminUserUtil.create(username, password);

    // obtain admin user access token
    const accessToken = await adminUserUtil.getAccessToken(username, password);

    const res = await tokenCheckRequest(accessToken);
    expect(res.statusCode).toBe(200);
    const resBody = JSON.parse(res.payload);
    expect(resBody).toHaveProperty('username', username);

    // clear admin user data
    await adminUserUtil.clear();
  });
});
