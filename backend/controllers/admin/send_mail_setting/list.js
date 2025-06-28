const models = require('../../../../db/models');

module.exports = async (request, reply) => {
  const SendMailSettings = await models.SendMailSetting.findAll({
    attributes: {
      exclude: ['id', 'createdAt', 'updatedAt']
    }
  });
  reply.send(SendMailSettings);
};
