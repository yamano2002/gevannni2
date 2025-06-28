const httpError = require('http-errors');
const tokenSrv = require('../../../../services/accessTokenService');

module.exports = async (request, reply) => {
  const isAdmin = reply.context.config.isAdmin || false;

  const accessToken = request.body.access_token;

  const userInfo = await tokenSrv.retrieveUserInfo(accessToken, isAdmin);
  // invalid access token
  if (userInfo === null) {
    throw new httpError.Unauthorized('Invalid access token.');
  }

  reply.send(userInfo);
};
