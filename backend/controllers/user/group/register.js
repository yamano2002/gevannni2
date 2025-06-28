const httpError = require('http-errors');
const models = require('../../../../db/models');
const authCodeSrv = require('../../../../services/user/authCodeService');
const modifyTokenSrv = require('../../../../services/user/groupModifyTokenService');
const groupRegisterMailSend = require('../../../../mail/groupRegisterMail');
const REGISTER_GROUP_ERROR = require('../../../../enums/errors/registerGroup')
  .default;

module.exports = async (request, reply) => {
  const groupAttrs = request.body;
  const listTag = groupAttrs.list_tag;
  const mail = groupAttrs.mail;

  // switch create or modify based on `id_pub` existence
  const isAdd = !groupAttrs.id_pub;

  // verify update token
  let modifyToken = null;
  if (!isAdd) {
    modifyToken = groupAttrs.modify_token;
    const isValid = await modifyTokenSrv.verify(
      listTag,
      groupAttrs.id_pub,
      modifyToken
    );
    if (!isValid) {
      reply.send(
        new httpError.BadRequest(REGISTER_GROUP_ERROR.INVALID_MODIFY_TOKEN)
      );
      return;
    }
  }

  // verify auth code
  const authCode = groupAttrs.mail_auth_code;
  if (!(await authCodeSrv.verify(listTag, mail, authCode))) {
    reply.send(
      new httpError.BadRequest(REGISTER_GROUP_ERROR.MISMATCH_AUTH_CODE)
    );
    return;
  }

  // register to DB
  let newGroup = null;
  try {
    if (isAdd) {
      newGroup = await models.Group.create(groupAttrs);
    } else {
      newGroup = await models.Group.modify(groupAttrs);
    }
  } catch (e) {
    reply.send(new httpError.BadRequest(e.message));
    return;
  }
  // group registration success

  // send mail
  await groupRegisterMailSend(newGroup, isAdd);

  // delete token and code
  if (!isAdd) {
    await modifyTokenSrv.deleteToken(modifyToken);
  }
  await authCodeSrv.deleteCode(listTag, mail);

  reply.send({});
};
