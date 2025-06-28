const fastify = require('../../../../../backend/bootstrap')();
const adminUserUtil = require('../../../../test-utilities/adminUser');
const scopes = require('../../../../../enums/adminScopes').default;
const models = require('../../../../../db/models');
const escapeHSpChars = require('../../../../../utilities/escapeHSpChars');

let accessToken;

async function listSaveReqest(payload) {
  return await fastify.inject({
    method: 'PUT',
    url: '/adm/list/save',
    payload: payload,
    headers: {
      Authorization: 'Bearer ' + accessToken
    }
  });
}

describe('backend route /adm/list/save', () => {
  afterEach(async () => {
    await models.List.destroy({ where: {} });
    await adminUserUtil.clear();
  });

  test('failure (missing scope)', async () => {
    const username = 'test-user';
    const password = 'test_passw00d';

    await adminUserUtil.create(username, password, []);

    accessToken = await adminUserUtil.getAccessToken(username, password);

    // attempt create list
    const listName = 'テストリスト';
    const res = await listSaveReqest({
      name: listName,
      tag: 'test',
      group_id_prefix: 'test'
    });
    expect(res.statusCode).toBe(403);

    // check if the list has not been created
    const listCount = await models.List.count({
      where: { name: listName }
    });
    expect(listCount).toBe(0);
  });

  test('success (create & update)', async () => {
    const username = 'test-user';
    const password = 'test_passw00d';

    await adminUserUtil.create(username, password, [scopes.LIST]);

    accessToken = await adminUserUtil.getAccessToken(username, password);

    // attempt create list
    const list1_1 = {
      name: 'テスト1',
      tag: 'test1',
      group_id_prefix: 'test1'
    };
    const res1_1 = await listSaveReqest(list1_1);
    expect(res1_1.statusCode).toBe(200);

    // check if the list has been created
    const listInstance1_1 = await models.List.findOne({
      where: list1_1
    });
    expect(listInstance1_1).not.toBeNull();

    // attempt update list
    const list1_2 = {
      id: listInstance1_1.id,
      name: 'テスト1-renamed',
      tag: 'test1',
      group_id_prefix: 'test1',
      user_form_enabled: true,
      user_form_color: '#dddddd'
    };
    const res1_2 = await listSaveReqest(list1_2);
    expect(res1_2.statusCode).toBe(200);
    // check if the list has been updated
    const listCount1_2 = await models.List.count({
      where: escapeHSpChars(list1_2)
    });
    expect(listCount1_2).toBe(1);
  });

  test('failure (unique constraint violation)', async () => {
    const username = 'test-user';
    const password = 'test_passw00d';

    await adminUserUtil.create(username, password, [scopes.LIST]);

    accessToken = await adminUserUtil.getAccessToken(username, password);

    // create 1st list
    const list1 = {
      name: 'テスト',
      tag: 'test1',
      group_id_prefix: 'test1'
    };
    await listSaveReqest(list1);

    // attempt create another list with same name as 1st one
    const list2 = {
      name: 'テスト', // same
      tag: 'test2',
      group_id_prefix: 'test2'
    };
    const res = await listSaveReqest(list2);
    expect(res.statusCode).toBe(400);

    // check if the list has not been created
    const listCount = await models.List.count({
      where: list2
    });
    expect(listCount).toBe(0);
  });
});
