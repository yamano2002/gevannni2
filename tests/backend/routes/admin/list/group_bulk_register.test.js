const fastify = require('../../../../../backend/bootstrap')();
const models = require('../../../../../db/models');
const scopes = require('../../../../../enums/adminScopes').default;
const adminUser = require('../../../../test-utilities/adminUser');

const user1 = 'user1';
const password = 'pasw00d';

let accessToken;
jest.setTimeout(15000);
async function addGroupRequest(listid, payload) {
  return await fastify.inject({
    method: 'POST',
    url: '/adm/list/' + listid + '/groups/bulk_register',
    headers: {
      Authorization: 'Bearer ' + accessToken
    },
    payload: payload
  });
}

describe('backend admin _register', () => {
  beforeAll(async () => {
    await adminUser.create(user1, password, [scopes.GROUP]); //make adminuser(with scope)
    accessToken = await adminUser.getAccessToken(user1, password);
  });

  afterAll(async () => {
    await adminUser.clear();
  });

  beforeEach(async () => {
    // create test group
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
    await models.List.destroy({ where: {} });
    await models.Group.destroy({ where: {}, force: true });
  });

  test('success', async () => {
    //valid
    const addGroupRes1 = await addGroupRequest(1, [
      {
        name: 'テスト団体1',
        name_kana: 'テストダンタイイチ',
        charge_person_name: '試験中',
        tel: '09012345678',
        mail: 'test@test.com'
      },
      {
        name: 'テスト団体2',
        name_kana: 'テストダンタイニ',
        charge_person_name: '試験仮',
        tel: '08012345678',
        mail: 'test2@test2.com'
      }
    ]);

    expect(addGroupRes1.statusCode).toBe(200);
    const res1 = JSON.parse(addGroupRes1.payload);
    expect(res1).toEqual({});

    const countGroup = await models.Group.count({
      where: {}
    });
    expect(countGroup).toBe(2); //registerd these groups
  });

  test('required', async () => {
    //omitting required property
    const addGroupRes2 = await addGroupRequest(1, [
      {
        name: 'テスト団体2',
        name_kana: 'テストダンタイニ',
        charge_person_name: '試験中'
      }
    ]);

    expect(addGroupRes2.statusCode).toBe(400);
    const countGroup2 = await models.Group.count({
      where: {}
    });
    expect(countGroup2).toBe(0);
  });

  test('listnotfound', async () => {
    //non-existing list
    const addGroupRes3 = await addGroupRequest(2, [
      {
        name: 'テスト団体3',
        name_kana: 'テストダンタイサン',
        charge_person_name: '試験中',
        tel: '09012345678',
        mail: 'test@test.com'
      }
    ]);

    expect(addGroupRes3.statusCode).toBe(400);
    const countGroup3 = await models.Group.count({
      where: {}
    });
    expect(countGroup3).toBe(0);
  });

  test('groupduplicate', async () => {
    //duplicate mail or name
    await addGroupRequest(1, [
      {
        name: 'テスト団体1',
        name_kana: 'テストダンタイイチ',
        charge_person_name: '試験中',
        tel: '09012345678',
        mail: 'test@test.com'
      }
    ]);

    const addGroupRes4_1 = await addGroupRequest(1, [
      //same name
      {
        name: 'テスト団体1',
        name_kana: 'テストダンタイイチ',
        charge_person_name: '試験中',
        tel: '09012345678',
        mail: 'testing@testing.com'
      }
    ]);
    expect(addGroupRes4_1.statusCode).toBe(400);
    const countGroup4_1 = await models.Group.count({
      where: {}
    });
    expect(JSON.parse(addGroupRes4_1.payload)).toEqual({
      error_type: 'duplicated',
      index: 0,
      field: 'name',
      value: 'テスト団体1'
    });
    expect(countGroup4_1).toBe(1); //only first group

    const addGroupRes4_2 = await addGroupRequest(1, [
      //same mail
      {
        name: 'テスト団体2',
        name_kana: 'テストダンタイニ',
        charge_person_name: '試験中',
        tel: '09012345678',
        mail: 'test@test.com'
      }
    ]);

    expect(addGroupRes4_2.statusCode).toBe(400);

    const countGroup4_2 = await models.Group.count({
      where: {}
    });
    expect(JSON.parse(addGroupRes4_2.payload)).toEqual({
      error_type: 'duplicated',
      index: 0,
      field: 'mail',
      value: 'test@test.com'
    });
    expect(countGroup4_2).toBe(1); //only first group
  });

  test('bulkduplicate', async () => {
    const addGroupRes5 = await addGroupRequest(1, [
      {
        name: 'テスト団体5',
        name_kana: 'テストダンタイゴ',
        charge_person_name: '試験中',
        tel: '09012345678',
        mail: 'test@test.com'
      },
      {
        name: 'テスト団体5',
        name_kana: 'テストダンタイゴ',
        charge_person_name: '試験仮',
        tel: '09012345678',
        mail: 'test@test.com'
      }
    ]);
    expect(addGroupRes5.statusCode).toBe(400);
    expect(JSON.parse(addGroupRes5.payload)).toEqual({
      error_type: 'duplicated',
      index: 1,
      field: 'name',
      value: 'テスト団体5'
    });
    const countGroup5 = await models.Group.count({
      where: {}
    });
    expect(countGroup5).toBe(0);
  });
});
