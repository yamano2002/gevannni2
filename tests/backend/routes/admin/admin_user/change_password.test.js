const fastify = require('../../../../../backend/bootstrap')();
const models = require('../../../../../db/models');
const passwordSrv = require('../../../../../services/passwordService');
const redisSrv = require('../../../../../services/redisService');
const scopes = require('../../../../../enums/adminScopes').default;

describe('backend route /admin/admin_user/change_password', () => {
  afterEach(async () => {
    await models.AdminUser.destroy({ where: {} });
    await models.AdminScope.destroy({ where: {} });
    await redisSrv.flushdb();
  });

  test('success', async () => {
    const username = 'test-user';
    const password = 'test_passw00d';
    const newPassword = 'new_passw00d';

    // create test admin user with required scope
    await models.AdminUser.create(
      {
        name: username,
        password_hashed: await passwordSrv.genHash(password),
        AdminScopes: [{ name: scopes.CHANGE_PSWD }]
      },
      {
        include: [models.AdminScope]
      }
    );

    // Obtain access token
    const tokenIssueRes = await fastify.inject({
      method: 'POST',
      url: '/adm/access_token/issue',
      payload: {
        username: username,
        password: password
      }
    });
    const accessToken = JSON.parse(tokenIssueRes.payload).access_token;

    // attempt change password
    const changePswdRes = await fastify.inject({
      method: 'PATCH',
      url: '/adm/admin_user/change_password',
      payload: {
        username: username,
        new_password: newPassword
      },
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });
    expect(changePswdRes.statusCode).toBe(200);

    // check if the password has been changed
    const adminUser = await models.AdminUser.findOne({
      where: { name: username }
    });
    expect(await adminUser.verifyPassword(newPassword)).toBe(true);
  });

  test('failure (missing scope)', async () => {
    const username = 'test-user';
    const password = 'test_passw00d';
    const newPassword = 'new_passw00d';

    // create test admin user without scope
    await models.AdminUser.create({
      name: username,
      password_hashed: await passwordSrv.genHash(password)
    });

    // Obtain access token
    const tokenIssueRes = await fastify.inject({
      method: 'POST',
      url: '/adm/access_token/issue',
      payload: {
        username: username,
        password: password
      }
    });
    const accessToken = JSON.parse(tokenIssueRes.payload).access_token;

    // attempt change password
    const changePswdRes = await fastify.inject({
      method: 'PATCH',
      url: '/adm/admin_user/change_password',
      payload: {
        username: username,
        new_password: newPassword
      },
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });
    expect(changePswdRes.statusCode).toBe(403);

    // check if the password has not been changed
    const adminUser = await models.AdminUser.findOne({
      where: { name: username }
    });
    expect(await adminUser.verifyPassword(password)).toBe(true);
  });

  test('failure (non-exist username)', async () => {
    const username = 'test-user';
    const password = 'test_passw00d';
    const newPassword = 'new_passw00d';

    // create test admin user with required scope
    await models.AdminUser.create(
      {
        name: username,
        password_hashed: await passwordSrv.genHash(password),
        AdminScopes: [{ name: scopes.CHANGE_PSWD }]
      },
      {
        include: [models.AdminScope]
      }
    );

    // Obtain access token
    const tokenIssueRes = await fastify.inject({
      method: 'POST',
      url: '/adm/access_token/issue',
      payload: {
        username: username,
        password: password
      }
    });
    const accessToken = JSON.parse(tokenIssueRes.payload).access_token;

    // attempt change password of non-exist user
    const changePswdRes = await fastify.inject({
      method: 'PATCH',
      url: '/adm/admin_user/change_password',
      payload: {
        username: 'non-exist-user',
        new_password: newPassword
      },
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });
    expect(changePswdRes.statusCode).toBe(400);
  });
});
