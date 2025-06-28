const apiTokenSrv = require('../../../../services/apiTokenService');

module.exports = async (request, reply) => {
  const apiToken = await apiTokenSrv.get();
  reply.send({
    token: apiToken
  });
};
