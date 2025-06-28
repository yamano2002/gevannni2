const fastify = require('../../../../../backend/bootstrap')();
const adminUserUtil = require('../../../../test-utilities/adminUser');
const scopes = require('../../../../../enums/adminScopes').default;

let accessToken;

async function getApiTokenRequest() {
  return await fastify.inject({
    method: 'GET',
    url: '/adm/api_token',
    headers: {
      Authorization: 'Bearer ' + accessToken
    }
  });
}

const username = 'test-user';
const password = 'test-passw00d';

describe('GET /adm/api_token', () => {
  afterEach(async () => {
    await adminUserUtil.clear();
  });

  test('failure(missing scope)', async () => {
    accessToken = await adminUserUtil.createUserAndGetAccessToken(
      username,
      password,
      []
    );

    const getResponse = await getApiTokenRequest();
    expect(getResponse.statusCode).toBe(403);
  });

  test('success', async () => {
    accessToken = await adminUserUtil.createUserAndGetAccessToken(
      username,
      password,
      [scopes.API_TOKEN]
    );

    const getResponse2 = await getApiTokenRequest();
    expect(getResponse2.statusCode).toBe(200);
    expect(JSON.parse(getResponse2.body)).toEqual({ token: null });
  });
});
