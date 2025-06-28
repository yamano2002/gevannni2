const models = require('../../../../db/models');
const httpError = require('http-errors');
const sequelize = models.sequelize;
const errorMessages = require('../../../../enums/errors/registerGroup');

module.exports = async (request, reply) => {
  const List = await models.List.findOne({
    where: {
      id: request.params.listid
    }
  });
  if (List === null) {
    throw new httpError.BadRequest('List does not exist.');
    return;
  }

  const t = await sequelize.transaction(); //set transaction
  let index;

  try {
    for (let element of request.body) {
      index = request.body.indexOf(element);
      element['ListId'] = Number(request.params.listid);
      await models.Group.create(element, { transaction: t });
    }
    await t.commit();
  } catch (error) {
    await t.rollback();
    reply.code(400);
    reply.send({
      error_type: 'duplicated',
      index: index,
      field:
        error.message === errorMessages.default.GROUP_NAME_DUPLICATED
          ? 'name'
          : 'mail',
      value:
        error.message === errorMessages.default.GROUP_NAME_DUPLICATED
          ? request.body[index].name
          : request.body[index].mail
    });
    return;
  }
  reply.send({});
};
