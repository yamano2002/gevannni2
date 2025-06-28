const models = require('../../../../db/models');

module.exports = async (request, reply) => {
  const Lists = await models.List.findAll();
  reply.send(Lists);
};
