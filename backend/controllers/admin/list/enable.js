const models = require('../../../../db/models');

module.exports = async (request, reply) => {
  await models.List.update(
    { user_form_enabled: true },
    { where: { id: request.params.listid } }
  );
  reply.send({});
};
