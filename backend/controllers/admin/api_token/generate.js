const apiTokenSrv = require('../../../../services/apiTokenService');

module.exports = async (request, reply) => {
  const apiToken = await apiTokenSrv.generate();
  reply.send({
    token: apiToken
  });
};
