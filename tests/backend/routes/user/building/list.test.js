const fastify = require('../../../../../backend/bootstrap')();
const userUtil = require('../../../../test-utilities/user');
const models = require('../../../../../db/models');

describe('backend user buiding list', () => {
  beforeEach(async () => {
    // create test building
    await models.Building.create({
      id: 1,
      name: 'testbuild',
      tag: 'tag-test'
    });
  });

  afterEach(async () => {
    await models.Building.destroy({ where: {} }); //delete building
    await userUtil.clear();
  });

  test('success', async () => {
    const username = 'test-user';
    const password = 'test-passw00d';

    await userUtil.create(username, password);

    const accessToken = await userUtil.getAccessToken(username, password);

    // attempt to get buildings
    const BuildingRes = await fastify.inject({
      method: 'GET',
      url: '/building',
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });
    expect(BuildingRes.statusCode).toBe(200);
    const res = JSON.parse(BuildingRes.payload);
    expect(res).toContainEqual({
      id: 1,
      name: 'testbuild',
      tag: 'tag-test'
    });
  });
});
