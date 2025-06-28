const models = require('../../../../db/models');

module.exports = async (request, reply) => {
  const MailTemplates = await models.MailTemplate.findAll({
    attributes: {
      exclude: ['id', 'createdAt', 'updatedAt']
    }
  });
  reply.send(MailTemplates);
};
