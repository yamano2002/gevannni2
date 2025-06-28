const httpError = require('http-errors');
const models = require('../../../../db/models');

module.exports = async (request, reply) => {
  const username = request.body.username;
  const newPasswordPlain = request.body.new_password;

  const adminUser = await models.AdminUser.findOne({
    where: { name: username }
  });
  if (adminUser === null) {
    // non-exist username
    reply.send(new httpError.BadRequest('User name not found.'));
    return;
  }

  await adminUser.changePassword(newPasswordPlain);

  reply.send({});
};
