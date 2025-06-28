const appConfig = require('../config/app').default;
const mailTemplateTag = require('../enums/mailTmpTag');
const mailFactory = require('./utilities/mailFactory');

module.exports = async (mail, authCode) => {
  const replaces = {
    auth_code: authCode,
    code_exp_min: appConfig.REDIS_USER_MAIL_AUTH_CODE_EXPIRATION
  };

  const sender = new mailFactory({ templateTag: mailTemplateTag.AUTH_CODE });
  await sender.send(mail, replaces);
};
