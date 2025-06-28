const models = require('../../../../db/models');

module.exports = async (request, reply) => {
  await models.Group.destroy({
    where: {
      id: request.params.groupId
    }
  });
  reply.send({});
};
