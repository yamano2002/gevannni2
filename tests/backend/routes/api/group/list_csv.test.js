const fastify = require('../../../../../backend/bootstrap')();
const apiTokenSrv = require('../../../../../services/apiTokenService');

describe('backend route /api/group/list_csv', () => {
  test('success', async () => {
    const apiToken = await apiTokenSrv.generate();

    const res = await fastify.inject({
      method: 'GET',
      url: '/api/group/list_csv/some_list',
      headers: {
        Authorization: 'Bearer ' + apiToken
      }
    });
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toBe('text/csv');
    const resBody = res.payload;
    expect(resBody).not.toBe(null);

    await apiTokenSrv.delete();
  });
});
