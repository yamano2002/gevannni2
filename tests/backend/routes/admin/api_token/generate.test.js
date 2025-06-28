const fastify = require('../../../../../backend/bootstrap')();
const adminUserUtil = require('../../../../test-utilities/adminUser');
const scopes = require('../../../../../enums/adminScopes').default;
const { SystemSetting } = require('../../../../../db/models');

let accessToken;

async function generateApiTokenRequest() {
  return await fastify.inject({
    method: 'POST',
    url: '/adm/api_token/generate',
    headers: {
      Authorization: 'Bearer ' + accessToken
    }
  });
}

const username = 'test-user';
const password = 'test-passw00d';

describe('POST /adm/api_token/generate', () => {
  afterEach(async () => {
    await adminUserUtil.clear();
  });

  test('failure(missing scope)', async () => {
    accessToken = await adminUserUtil.createUserAndGetAccessToken(
      username,
      password,
      []
    );

    const response = await generateApiTokenRequest();
    expect(response.statusCode).toBe(403);
  });

  test('success', async () => {
    accessToken = await adminUserUtil.createUserAndGetAccessToken(
      username,
      password,
      [scopes.API_TOKEN]
    );

    const response1 = await generateApiTokenRequest();
    expect(response1.statusCode).toBe(200);
    expect(JSON.parse(response1.body)).toEqual({ token: expect.any(String) });

    const response2 = await fastify.inject({
      method: 'GET',
      url: '/adm/api_token',
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });
    expect(response2.statusCode).toBe(200);
    expect(JSON.parse(response2.body)).toEqual({ token: expect.any(String) });

    await SystemSetting.destroy({ where: {} });
  });
});
