const models = require('../../../../db/models');

module.exports = async (request, reply) => {
  await models.User.destroy({
    where: {
      id: request.params.userId
    }
  });
  reply.send({});
};
