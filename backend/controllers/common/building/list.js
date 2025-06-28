const models = require('../../../../db/models');

module.exports = async (request, reply) => {
  const Buildings = await models.Building.findAll({
    where: {},
    attributes: ['id', 'name', 'tag']
  });
  reply.send(Buildings);
};
