const authCodeSrv = require('../../../../services/user/authCodeService');
const authCodeMailSend = require('../../../../mail/authCodeMail');

module.exports = async (request, reply) => {
  const listTag = request.body.list_tag;
  const mail = request.body.mail;

  const authCode = await authCodeSrv.issue(listTag, mail);

  await authCodeMailSend(mail, authCode);

  reply.send({});
};
