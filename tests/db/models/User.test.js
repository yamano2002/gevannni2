const models = require('../../../db/models');

async function createUser(username, password) {
  await models.User.create({
    name: username,
    password: password
  });
}

describe('model Group', () => {
  afterEach(async () => {
    await models.User.truncate({});
  });

  test('Create Success', async () => {
    const username = 'test-user';
    const password = 'test_pasw00d';

    await createUser(username, password);

    const user = await models.User.findOne({
      where: {
        name: username
      }
    });
    expect(user).not.toBeNull();
    expect(await user.verifyPassword(password)).toBe(true);
    expect(await user.verifyPassword('wrong_password')).toBe(false);
  });

  test('Create Failure (name duplicate)', async () => {
    const username = 'test-user';
    const password = 'test_pasw00d';

    await createUser(username, password);

    expect.assertions(1);

    try {
      // same username as the first user
      await createUser(username, 'another_password');
    } catch (e) {
      expect(true).toBe(true);
    }
  });

  test('Update Success', async () => {
    const username1 = 'test-user1';
    const password1 = 'test_pasw00d1';
    const username2 = 'test-user2';
    const password2 = 'test_pasw00d2';

    await createUser(username1, password1);

    await (await models.User.findOne({
      where: {
        name: username1
      }
    })).update({
      name: username2,
      password: password2
    });

    const user1 = await models.User.findOne({
      where: {
        name: username1
      }
    });
    expect(user1).toBeNull();

    const user2 = await models.User.findOne({
      where: {
        name: username2
      }
    });
    expect(user2).not.toBeNull();
    expect(await user2.verifyPassword(password2)).toBe(true);
    expect(await user2.verifyPassword(password1)).toBe(false);
  });

  test('Update Failure (name duplicate)', async () => {
    const username1 = 'test-user1';
    const password1 = 'test_pasw00d1';
    const username2 = 'test-user2';
    const password2 = 'test_pasw00d2';

    await createUser(username1, password1);
    await createUser(username2, password2);

    expect.assertions(1);

    try {
      await (await models.User.findOne({
        where: {
          name: username1
        }
      })).update({
        name: username2, // duplicated
        password: 'another_password'
      });
    } catch (e) {
      expect(true).toBe(true);
    }
  });
});
