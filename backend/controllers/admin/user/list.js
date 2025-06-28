const models = require('../../../../db/models');

module.exports = async (request, reply) => {
  const Users = await models.User.findAll({
    attributes: ['id', 'name']
  });
  reply.send(Users);
};
