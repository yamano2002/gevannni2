const httpError = require('http-errors');
const models = require('../../../../db/models');

module.exports = async (request, reply) => {
  const reqBody = request.body;

  // if reqBody.id is not specified or does not exist, new User is created
  await models.User.findOrBuild({
    where: { id: reqBody.id }
  }).spread(async (instance, initialized) => {
    try {
      await instance.set(reqBody).save();
    } catch (e) {
      // throw exception if unique constraint is violated
      throw new httpError.BadRequest('Unique constraint is violated.');
    }
  });

  reply.send({});
};
