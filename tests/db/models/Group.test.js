const models = require('../../../db/models');
const cryptSrv = require('../../../services/cryptService');

const listId = 1;

describe('model Group', () => {
  beforeAll(async () => {
    await models.List.create({
      id: listId,
      name: 'test',
      tag: 'test',
      group_id_prefix: 'test'
    });
  });

  afterEach(async () => {
    await models.Group.destroy({ force: true, where: {} });
  });

  afterAll(async () => {
    await models.List.destroy({ where: {} });
  });

  test('Create Success', async () => {
    const id_pub = 1;
    const mail = 'test@example.com';
    const attrs = {
      name: 'test-group-1',
      name_kana: 'テストグループイチ',
      charge_person_name: 'test1',
      tel: '08012345678'
    };
    await models.Group.create({
      ListId: listId,
      id_pub: id_pub,
      mail: mail,
      ...attrs
    });

    const group = await models.Group.findOne({
      where: {
        ListId: listId,
        id_pub: id_pub,
        mail_crypt: cryptSrv.encrypt(mail),
        ...attrs
      }
    });
    expect(group).not.toBeNull();
  });

  test('Create Failure (duplicate)', async () => {
    const id_pub = 1;
    const name = 'test-group-1';
    const attrs = {
      name_kana: 'テストグループイチ',
      charge_person_name: 'test1',
      tel: '08012345678',
      mail: 'test@example.com'
    };
    await models.Group.create({
      ListId: listId,
      id_pub: id_pub,
      name: name,
      ...attrs
    });

    expect.assertions(2);

    try {
      await models.Group.create({
        ListId: listId,
        id_pub: id_pub, // duplicated
        name: 'test-group-2',
        ...attrs
      });
    } catch (e) {
      expect(e.message).toMatch('duplicated');
    }

    try {
      await models.Group.create({
        ListId: listId,
        id_pub: 2,
        name: name, // duplicated
        ...attrs
      });
    } catch (e) {
      expect(e.message).toMatch('duplicated');
    }
  });

  test('Modify Success', async () => {
    await models.Group.create({
      ListId: listId,
      id_pub: 1,
      name: 'test-group-1',
      name_kana: 'テストグループイチ',
      charge_person_name: 'test1',
      tel: '08012345678',
      mail: 'test1@example.com'
    });

    await models.Group.modify({
      ListId: listId,
      id_pub: 1,
      name: 'test-group-1-1',
      name_kana: 'テストグループイチイチ',
      charge_person_name: 'test1-1',
      tel: '09098765432',
      mail: 'test1-1@example.com'
    });

    // check if the prev row is soft deleted
    const prevGroup = await models.Group.findOne({
      where: {
        ListId: listId,
        id_pub: 1,
        name: 'test-group-1',
        name_kana: 'テストグループイチ',
        charge_person_name: 'test1',
        tel: '08012345678',
        mail_crypt: cryptSrv.encrypt('test1@example.com')
      },
      paranoid: false
    });
    expect(prevGroup).not.toBeNull();
    expect(prevGroup.isSoftDeleted()).toBe(true);

    const group = await models.Group.findOne({
      where: {
        ListId: listId,
        id_pub: 1,
        name: 'test-group-1-1',
        name_kana: 'テストグループイチイチ',
        charge_person_name: 'test1-1',
        tel: '09098765432',
        mail_crypt: cryptSrv.encrypt('test1-1@example.com')
      }
    });
    expect(group).not.toBeNull();
  });

  test('Modify Failure (non exist Group)', async () => {
    expect.hasAssertions();
    try {
      await models.Group.modify({
        ListId: listId,
        id_pub: 1,
        name: 'test-group-2', // duplicated as second
        name_kana: 'テストグループイチイチ',
        charge_person_name: 'test1-1',
        tel: '09098765432',
        mail: 'test1-1@example.com'
      });
    } catch (e) {
      expect(e.message).toMatch('not exist');
    }
  });

  test('Modify Failure (name duplicated)', async () => {
    expect.assertions(3);

    // create first group
    await models.Group.create({
      ListId: listId,
      id_pub: 1,
      name: 'test-group-1',
      name_kana: 'テストグループイチ',
      charge_person_name: 'test1',
      tel: '08012345678',
      mail: 'test1@example.com'
    });

    // create second group
    await models.Group.create({
      ListId: listId,
      id_pub: 2,
      name: 'test-group-2',
      name_kana: 'テストグループニ',
      charge_person_name: 'test2',
      tel: '08012345678',
      mail: 'test2@example.com'
    });

    // attempt modify first group
    try {
      await models.Group.modify({
        ListId: listId,
        id_pub: 1,
        name: 'test-group-2', // duplicated as second
        name_kana: 'テストグループイチイチ',
        charge_person_name: 'test1-1',
        tel: '09098765432',
        mail: 'test1-1@example.com'
      });
    } catch (e) {
      expect(e.message).toMatch('duplicated');
    }

    // check if the first group is not changed
    const group = await models.Group.findOne({
      where: {
        ListId: listId,
        id_pub: 1,
        name: 'test-group-1',
        name_kana: 'テストグループイチ',
        charge_person_name: 'test1',
        tel: '08012345678',
        mail_crypt: cryptSrv.encrypt('test1@example.com')
      }
    });
    expect(group).not.toBeNull();

    // check if modified group is not inserted
    const groupNext = await models.Group.findOne({
      where: {
        ListId: listId,
        id_pub: 1,
        name: 'test-group-2',
        name_kana: 'テストグループイチイチ',
        charge_person_name: 'test1-1',
        tel: '09098765432',
        mail_crypt: cryptSrv.encrypt('test1-1@example.com')
      }
    });
    expect(groupNext).toBeNull();
  });
});
