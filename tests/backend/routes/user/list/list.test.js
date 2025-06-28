const fastify = require('../../../../../backend/bootstrap')();
const userUtil = require('../../../../test-utilities/user');
const models = require('../../../../../db/models');

describe('backend user list list', () => {
  beforeEach(async () => {
    // create test list(false)
    await models.List.create({
      id: 1,
      name: 'testuser1',
      tag: 'tag-test1',
      group_id_prefix: 'gid-test1',
      user_form_enabled: false,
      user_form_color: '#ffffff'
    });
    //create test list(true)
    await models.List.create({
      id: 2,
      name: 'testuser2',
      tag: 'tag-test2',
      group_id_prefix: 'gid-test2',
      user_form_enabled: true,
      user_form_color: '#ffffff'
    });
  });

  afterEach(async () => {
    await models.List.destroy({ where: {} }); //delete list
    await userUtil.clear();
  });

  test('success', async () => {
    const username = 'test-user';
    const password = 'test-passw00d';

    await userUtil.create(username, password);

    const accessToken = await userUtil.getAccessToken(username, password);

    // attempt to get only true list
    const userListRes = await fastify.inject({
      method: 'GET',
      url: '/list',
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });
    expect(userListRes.statusCode).toBe(200);
    const res = JSON.parse(userListRes.payload);
    expect(res).toContainEqual({
      name: 'testuser2',
      tag: 'tag-test2',
      group_id_prefix: 'gid-test2',
      user_form_color: '#ffffff'
    });
    expect(res.length).toBe(1);
  });
});
