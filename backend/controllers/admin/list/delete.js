const models = require('../../../../db/models');

module.exports = async (request, reply) => {
  const Lists = await models.List.destroy({
    where: {
      id: request.params.listid
    }
  });
  reply.send({});
};
