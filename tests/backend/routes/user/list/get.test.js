const fastify = require('../../../../../backend/bootstrap')();
const userUtil = require('../../../../test-utilities/user');
const models = require('../../../../../db/models');

const username = 'test-user';
const password = 'test-passw00d';

let accessToken;

async function getListRequest(listTag) {
  return await fastify.inject({
    method: 'GET',
    url: '/list/' + listTag,
    headers: {
      Authorization: 'Bearer ' + accessToken
    }
  });
}

describe('backend user list get', () => {
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
    await userUtil.create(username, password);

    accessToken = await userUtil.getAccessToken(username, password);

    //attempt to get false list
    const falseListRes = await getListRequest('tag-test1');
    expect(falseListRes.statusCode).toBe(400);

    // attempt to get true list
    const trueListRes = await getListRequest('tag-test2');
    expect(trueListRes.statusCode).toBe(200);
    const res = JSON.parse(trueListRes.payload);
    expect(res).toEqual({
      name: 'testuser2',
      tag: 'tag-test2',
      group_id_prefix: 'gid-test2',
      user_form_color: '#ffffff'
    });

    //attempt to get null list
    const nullListRes = await getListRequest('tag-test3');
    expect(nullListRes.statusCode).toBe(400);
  });
});
