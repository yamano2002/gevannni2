const httpError = require('http-errors');
const models = require('../../../../db/models');
const tokenSrv = require('../../../../services/accessTokenService');

module.exports = async (request, reply) => {
  const isAdmin = reply.context.config.isAdmin || false;

  const username = request.body.username;
  const passwordPlain = request.body.password;

  let user = null;
  if (isAdmin) {
    user = await models.AdminUser.findOne({
      where: { name: username },
      include: [models.AdminScope]
    });
  } else {
    user = await models.User.findOne({
      where: { name: username }
    });
  }
  if (user === null) {
    // non-exist username
    reply.send(new httpError.Unauthorized('Authentication failed.'));
    return;
  }

  if (await user.verifyPassword(passwordPlain)) {
    // authentication success
    const username = user.name;
    const scopes = isAdmin ? await user.getScopeArray() : []; // non admin user has no scope
    const accessToken = await tokenSrv.issueAndStoreRedis(
      username,
      scopes,
      isAdmin
    );

    let res = {
      username: username,
      access_token: accessToken
    };
    if (isAdmin) {
      res.scopes = scopes;
    }
    return res;
  } else {
    // wrong password
    reply.send(new httpError.Unauthorized('Authentication failed.'));
  }
};
