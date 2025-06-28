const models = require('../../../../db/models');
const httpError = require('http-errors');

module.exports = async (request, reply) => {
  const Lists = await models.List.findOne({
    where: {
      tag: request.params.tag,
      user_form_enabled: true
    },
    attributes: ['name', 'tag', 'group_id_prefix', 'user_form_color']
  });
  if (Lists != null) {
    reply.send(Lists);
  } else {
    reply.send(new httpError.BadRequest('List not found.'));
  }
};
