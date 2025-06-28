const fastify = require('../../../../../backend/bootstrap')();
const userUtil = require('../../../../test-utilities/user');
const adminUserUtil = require('../../../../test-utilities/adminUser');

async function requestAccessToken(username, password) {
  return await fastify.inject({
    method: 'POST',
    url: '/access_token/issue',
    payload: {
      username: username,
      password: password
    }
  });
}

describe('backend route /access_token/issue', () => {
  afterEach(async () => {
    await userUtil.clear();
  });

  test('success', async () => {
    const username = 'test-user';
    const password = 'test-passw00d';

    await userUtil.create(username, password);

    const res = await requestAccessToken(username, password);
    expect(res.statusCode).toBe(200);
    const resBody = JSON.parse(res.payload);
    expect(resBody).toHaveProperty('username', username);
    expect(resBody).toHaveProperty('access_token');
  });

  test('failure (non-exist username)', async () => {
    const username = 'test-user';
    const password = 'test-passw00d';

    await userUtil.create(username, password);

    const res = await requestAccessToken('worng_username', password);
    expect(res.statusCode).toBe(401);
  });

  test('failure (wrong password)', async () => {
    const username = 'test-user';
    const password = 'test-passw00d';

    await userUtil.create(username, password);

    const res = await requestAccessToken(username, 'wrong_password');
    expect(res.statusCode).toBe(401);
  });

  test('failure (using admin User account)', async () => {
    const username = 'test-user';
    const password = 'test-passw00d';

    // create admin User
    await adminUserUtil.create(username, password);

    const res = await requestAccessToken(username, password);
    expect(res.statusCode).toBe(401);

    await adminUserUtil.clear();
  });
});
