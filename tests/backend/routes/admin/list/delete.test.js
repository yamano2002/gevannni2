const fastify = require('../../../../../backend/bootstrap')();
const models = require('../../../../../db/models');
const passwordSrv = require('../../../../../services/passwordService');
const redisSrv = require('../../../../../services/redisService');
const scopes = require('../../../../../enums/adminScopes').default;
const adminUser = require('../../../../test-utilities/adminUser');

const user1 = 'user1';
const password = 'pasw00d';

describe('backend route delete', () => {
  beforeEach(async () => {
    // create test list
    await models.List.create({
      id: 1,
      name: 'testuser',
      tag: 'tag-testuser',
      group_id_prefix: 'gid-test',
      user_form_enabled: false,
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

    // attempt to delete id:1 list
    const userListRes = await fastify.inject({
      method: 'DELETE',
      url: '/adm/list/1',
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });
    expect(userListRes.statusCode).toBe(200);
    const res = JSON.parse(userListRes.payload);
    expect(res).toEqual({});

    const searchlist = await models.List.findOne({ where: { id: 1 } });
    expect(searchlist).toBe(null); //confirm list is deleted
  });
});
