const httpError = require('http-errors');
const models = require('../../../../db/models');

module.exports = async (request, reply) => {
  const groupAttrs = request.body;

  // register to DB
  try {
    await models.Group.modify(groupAttrs);
  } catch (e) {
    reply.send(new httpError.BadRequest(e.message));
    return;
  }

  reply.send({});
};
