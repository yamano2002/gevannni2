const models = require('../../../../db/models');

module.exports = async (request, reply) => {
  const Lists = await models.List.findAll({
    where: {
      user_form_enabled: true
    },
    attributes: ['name', 'tag', 'group_id_prefix', 'user_form_color']
  });
  reply.send(Lists);
};
