const fastify = require('../../../../../backend/bootstrap')();
const models = require('../../../../../db/models');
const passwordSrv = require('../../../../../services/passwordService');
const redisSrv = require('../../../../../services/redisService');
const scopes = require('../../../../../enums/adminScopes').default;
const adminUser = require('../../../../test-utilities/adminUser');

const user1 = 'user1';
const password = 'pasw00d';

describe('backend route admin list enable', () => {
  beforeEach(async () => {
    // create test list
    await models.List.create({
      id: 1,
      name: 'testuser',
      tag: 'tag-testuser',
      group_id_prefix: 'gid-test',
      user_form_enabled: true,
      user_form_color: '#ffffff'
    });
  });

  afterEach(async () => {
    await adminUser.clear();
    await models.List.destroy({ where: {} }); //delete list
  });

  test('success', async () => {
    // Obtain access token of user with token
    await adminUser.create(user1, password, [scopes.LIST]); //make adminuser(with scope)

    const accessToken = await adminUser.getAccessToken(user1, password);

    // attempt to disable id:1 list
    const userListRes = await fastify.inject({
      method: 'PATCH',
      url: '/adm/list/1/user_form/disable',
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });
    expect(userListRes.statusCode).toBe(200);
    const res = JSON.parse(userListRes.payload);
    expect(res).toEqual({});

    // check if the target List has been enabled
    const list = await models.List.findByPk(1);
    expect(list.user_form_enabled).toBe(false);
  });
});
