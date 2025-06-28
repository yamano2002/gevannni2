const httpError = require('http-errors');
const models = require('../../../../db/models');

module.exports = async (request, reply) => {
  const tag = request.body.tag;
  const value = request.body.value;

  const sendMailSetting = await models.SendMailSetting.findByTag(tag);
  if (sendMailSetting === null) {
    // non-exist SendMailSetting tag
    reply.send(new httpError.BadRequest('SendMailSetting tag not found.'));
    return;
  }

  sendMailSetting.value = value;
  await sendMailSetting.save();

  reply.send({});
};
