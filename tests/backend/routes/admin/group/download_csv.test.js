const fastify = require('../../../../../backend/bootstrap')();
const adminUser = require('../../../../test-utilities/adminUser');

const user1 = 'user1';
const password = 'pasw00d';

describe('backend route /admin/list/list', () => {
  afterEach(async () => {
    await adminUser.clear();
  });

  test('success', async () => {
    // create admin user
    await adminUser.create(user1, password, []);

    const accessToken = await adminUser.getAccessToken(user1, password);

    const downloadRes = await fastify.inject({
      method: 'GET',
      url: '/adm/group/download_csv',
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });
    expect(downloadRes.statusCode).toBe(200);
    const res = downloadRes.payload;
    expect(res).not.toBe(null);
  });
});
