const fastify = require('../../backend/bootstrap')();
const models = require('../../db/models');
const passwordSrv = require('../../services/passwordService');
const redisSrv = require('../../services/redisService');

const create = async (username, password, scopes = []) => {
  if (!Array.isArray(scopes)) {
    scopes = [scopes];
  }

  scopes = scopes.map(scope => {
    return { name: scope };
  });

  await models.AdminUser.create(
    {
      name: username,
      password_hashed: await passwordSrv.genHash(password),
      AdminScopes: scopes
    },
    {
      include: [models.AdminScope]
    }
  );
};

const getAccessToken = async (username, password) => {
  const res = await fastify.inject({
    method: 'POST',
    url: '/adm/access_token/issue',
    payload: {
      username: username,
      password: password
    }
  });

  return JSON.parse(res.payload).access_token;
};

module.exports = {
  create,
  getAccessToken,
  createUserAndGetAccessToken: async (username, password, scopes = []) => {
    await create(username, password, scopes);
    return await getAccessToken(username, password);
  },
  clear: async () => {
    await models.AdminUser.destroy({ where: {} });
    await models.AdminScope.destroy({ where: {} });
    await redisSrv.flushdb();
  }
};
