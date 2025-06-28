const fastify = require('../../../../../backend/bootstrap')();
const models = require('../../../../../db/models');
const passwordSrv = require('../../../../../services/passwordService');
const redisSrv = require('../../../../../services/redisService');
const scopes = require('../../../../../enums/adminScopes').default;

const user1 = 'user1';
const user2 = 'user2';
const password = 'pasw00d';

describe('backend route /admin/admin_user/list', () => {
  beforeEach(async () => {
    // create test admin user with required scope
    await models.AdminUser.create(
      {
        name: user1,
        password_hashed: await passwordSrv.genHash(password),
        AdminScopes: [{ name: scopes.OBTAIN_USER_LIST }]
      },
      {
        include: [models.AdminScope]
      }
    );

    // create test admin user without scope
    await models.AdminUser.create({
      name: user2,
      password_hashed: await passwordSrv.genHash(password)
    });
  });

  afterEach(async () => {
    await models.AdminUser.destroy({ where: {} });
    await models.AdminScope.destroy({ where: {} });
    await redisSrv.flushdb();
  });

  test('success', async () => {
    // Obtain access token of user with token
    const tokenIssueRes = await fastify.inject({
      method: 'POST',
      url: '/adm/access_token/issue',
      payload: {
        username: user1,
        password: password
      }
    });
    const accessToken = JSON.parse(tokenIssueRes.payload).access_token;

    // attempt obtain user list
    const userListRes = await fastify.inject({
      method: 'GET',
      url: '/adm/admin_user/list',
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });
    expect(userListRes.statusCode).toBe(200);
    const res = JSON.parse(userListRes.payload);
    expect(res).toContainEqual({
      name: user1,
      scopes: [scopes.OBTAIN_USER_LIST]
    });
    expect(res).toContainEqual({
      name: user2,
      scopes: []
    });
  });

  test('failure (missing scope)', async () => {
    // Obtain access token of user without token
    const tokenIssueRes = await fastify.inject({
      method: 'POST',
      url: '/adm/access_token/issue',
      payload: {
        username: user2,
        password: password
      }
    });
    const accessToken = JSON.parse(tokenIssueRes.payload).access_token;

    // attempt obtain user list
    const userListRes = await fastify.inject({
      method: 'GET',
      url: '/adm/admin_user/list',
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });
    expect(userListRes.statusCode).toBe(403);
  });
});
