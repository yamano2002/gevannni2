const fastify = require('../../../../../backend/bootstrap')();
const adminUserUtil = require('../../../../test-utilities/adminUser');
const scopes = require('../../../../../enums/adminScopes').default;
const models = require('../../../../../db/models');

let accessToken;

async function userSaveRequest(payload) {
  return await fastify.inject({
    method: 'PUT',
    url: '/adm/user/save',
    payload: payload,
    headers: {
      Authorization: 'Bearer ' + accessToken
    }
  });
}

describe('backend route /adm/user/save', () => {
  afterEach(async () => {
    await models.User.destroy({ where: {} });
    await adminUserUtil.clear();
  });

  test('failure (missing scope)', async () => {
    const adminUsername = 'test-user';
    const adminPassword = 'test_passw00d';

    await adminUserUtil.create(adminUsername, adminPassword, []);

    accessToken = await adminUserUtil.getAccessToken(
      adminUsername,
      adminPassword
    );

    // attempt create user
    const userName = 'testuser';
    const res = await userSaveRequest({
      name: userName,
      password: 'password'
    });
    expect(res.statusCode).toBe(403);

    // check if the user has not been created
    const userCount = await models.User.count({
      where: { name: userName }
    });
    expect(userCount).toBe(0);
  });

  test('success (create & update)', async () => {
    const adminUsername = 'test-user';
    const adminPassword = 'test_passw00d';

    await adminUserUtil.create(adminUsername, adminPassword, [scopes.USER]);

    accessToken = await adminUserUtil.getAccessToken(
      adminUsername,
      adminPassword
    );

    // attempt create user
    const user1_1_name = 'testuser1_1';
    const user1_1_password = 'testuser1_1';
    const res1_1 = await userSaveRequest({
      name: user1_1_name,
      password: user1_1_password
    });
    expect(res1_1.statusCode).toBe(200);

    // check if the user has been created and verify password
    const userInstance1_1 = await models.User.findOne({
      where: {
        name: user1_1_name
      }
    });
    expect(userInstance1_1).not.toBeNull();
    expect(await userInstance1_1.verifyPassword(user1_1_password)).toBe(true);

    // attempt update user
    const user1_2_name = 'testuser1_2';
    const user1_2_password = 'testuser1_2';
    const res1_2 = await userSaveRequest({
      id: userInstance1_1.id,
      name: user1_2_name,
      password: user1_2_password
    });
    expect(res1_2.statusCode).toBe(200);

    // check if the user has been updated and verify password
    const userInstance1_2 = await models.User.findOne({
      where: {
        id: userInstance1_1.id
      }
    });
    expect(userInstance1_2).not.toBeNull();
    expect(await userInstance1_2.verifyPassword(user1_2_password)).toBe(true);
  });

  test('failure (unique constraint violation)', async () => {
    const adminUsername = 'test-user';
    const adminPassword = 'test_passw00d';

    await adminUserUtil.create(adminUsername, adminPassword, [scopes.USER]);

    accessToken = await adminUserUtil.getAccessToken(
      adminUsername,
      adminPassword
    );

    // create 1st user
    const user1 = {
      name: 'testuser',
      password: 'password'
    };
    await userSaveRequest(user1);

    // attempt create another user with same name as 1st one
    const user2_name = 'testuser';
    const res = await userSaveRequest({
      name: user2_name,
      password: 'password'
    });
    expect(res.statusCode).toBe(400);

    // check if the user has not been created
    const userCount = await models.User.count();
    expect(userCount).toBe(1);
  });
});
