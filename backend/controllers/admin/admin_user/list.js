const models = require('../../../../db/models');

module.exports = async (request, reply) => {
  const adminUsers = await models.AdminUser.findAll({
    attributes: ['name'],
    include: [models.AdminScope]
  });

  let adminUsersJson = [];
  for (let user of adminUsers) {
    let userJson = user.toJSON();
    userJson.scopes = await user.getScopeArray();
    delete userJson.AdminScopes;
    adminUsersJson.push(userJson);
  }

  reply.send(adminUsersJson);
};
