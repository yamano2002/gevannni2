const httpError = require('http-errors');
const models = require('../../../../db/models');

module.exports = async (request, reply) => {
  const tag = request.body.tag;

  const mailTemplate = await models.MailTemplate.findByTag(tag);
  if (mailTemplate === null) {
    // non-exist SendMailSetting tag
    reply.send(new httpError.BadRequest('MailTemplate tag not found.'));
    return;
  }

  mailTemplate.set(request.body);
  await mailTemplate.save();

  reply.send({});
};
