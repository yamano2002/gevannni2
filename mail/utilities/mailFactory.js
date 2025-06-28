const sendMailSettingTag = require('../../enums/sendMailSettingTag').default;
const models = require('../../db/models');
const SendMailSettingModel = models.SendMailSetting;
const MailTemplateModel = models.MailTemplate;
const mailerSrv = require('../../services/mailerService');
const replaceVars = require('./replaceVars');

const DOMAIN = sendMailSettingTag.FROM_ADDRESS_DOMAIN;
const FOOTER_SIGN = sendMailSettingTag.MAIL_FOOTER_SIGN;
const NAME_ORG = sendMailSettingTag.ORGANIZATION_NAME;
const ADDR_QUESTION = sendMailSettingTag.INQUIRY_ADDRESS;

module.exports = function({ templateTag, mailAttr }) {
  this.initialized = false;
  this.templateTag = templateTag || null;
  this.SendMailSettingValues = {};
  this.mailAttr = mailAttr || null;
  this.mailer = null;

  this.init = async () => {
    this.SendMailSettingValues = await SendMailSettingModel.getValuesByTag([
      DOMAIN,
      FOOTER_SIGN,
      NAME_ORG,
      ADDR_QUESTION
    ]);

    if (this.mailAttr === null && this.templateTag !== null) {
      this.mailAttr = await MailTemplateModel.findByTag(this.templateTag);
    }

    this.mailer = new mailerSrv();

    this.initialized = true;
  };

  this.generateHeaders = to => {
    let headers = {
      to: to,
      subject: this.mailAttr.subject
    };

    const from = this.mailer.constructFrom(
      this.SendMailSettingValues[DOMAIN],
      this.mailAttr.from_address_local_part,
      this.mailAttr.from_address_name
    );
    if (from) {
      headers.from = from;
    }

    if (this.mailAttr.reply_to) {
      headers.replyTo = this.mailAttr.reply_to;
    }

    return headers;
  };

  this.generateBody = (replaces = {}) => {
    let body = this.mailAttr.body;

    const commonVars = {
      name_org: this.SendMailSettingValues[NAME_ORG],
      addr_question: this.SendMailSettingValues[ADDR_QUESTION]
    };

    body = replaceVars(body, { ...commonVars, ...replaces });

    if (this.mailAttr.has_sign) {
      body += '\n' + this.SendMailSettingValues[FOOTER_SIGN];
    }

    return body;
  };

  this.send = async (to, replaces = {}, additionalHeaders = {}) => {
    if (!this.initialized) {
      await this.init();
    }

    const headers = this.generateHeaders(to);
    const body = this.generateBody(replaces);

    const mailData = {
      ...headers,
      ...additionalHeaders,
      text: body
    };

    return await this.mailer.sendMail(mailData);
  };
};
