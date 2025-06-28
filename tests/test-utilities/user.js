const fastify = require('../../backend/bootstrap')();
const models = require('../../db/models');
const redisSrv = require('../../services/redisService');

module.exports = {
  create: async (username, password) => {
    await models.User.create({
      name: username,
      password: password
    });
  },
  getAccessToken: async (username, password) => {
    const res = await fastify.inject({
      method: 'POST',
      url: '/access_token/issue',
      payload: {
        username: username,
        password: password
      }
    });

    return JSON.parse(res.payload).access_token;
  },
  clear: async () => {
    await models.User.destroy({ where: {} });
    await redisSrv.flushdb();
  }
};
