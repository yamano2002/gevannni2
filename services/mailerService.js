const env = process.env.NODE_ENV || 'development';
const _config = require('../config/mailer')[env];
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const sendMailSettingTag = require('../enums/sendMailSettingTag').default;
const SendMailSettingModel = require('../db/models').SendMailSetting;

const SUBJECT_PREFIX = env !== 'production' ? `[${env}] ` : '';

const DOMAIN = sendMailSettingTag.FROM_ADDRESS_DOMAIN;
const FROM_NAME = sendMailSettingTag.DEFAULT_FROM_NAME;
const FROM_ADDRESS_LOCAL_PART =
  sendMailSettingTag.DEFAULT_FROM_ADDRESS_LOCAL_PART;
const REPLY_ADDRESS = sendMailSettingTag.DEFAULT_REPLY_ADDRESS;

const constructFrom = (domain, localPart = null, name = null) => {
  if (!localPart) {
    return null;
  }

  let from = `${localPart}@${domain}`;
  if (name) {
    from = `${name} <${from}>`;
  }
  return from;
};

const defaultMailSetting = async function() {
  const settingValues = await SendMailSettingModel.getValuesByTag([
    DOMAIN,
    FROM_NAME,
    FROM_ADDRESS_LOCAL_PART,
    REPLY_ADDRESS
  ]);

  let returnSettings = {};

  const from = constructFrom(
    settingValues[DOMAIN],
    settingValues[FROM_ADDRESS_LOCAL_PART],
    settingValues[FROM_NAME]
  );
  if (from) {
    returnSettings.from = from;
  }

  if (settingValues[REPLY_ADDRESS]) {
    returnSettings.replyTo = settingValues[REPLY_ADDRESS];
  }

  return returnSettings;
};

module.exports = function() {
  this.mailer = null;

  this.defMailSet = null;

  this.createTransport = async (config = {}) => {
    config = { ..._config, ...config };
    if (config.mailgun) {
      config = mg(config);
    }

    this.defMailSet = await defaultMailSetting();

    this.mailer = nodemailer.createTransport(config, this.defMailSet);
  };

  this.sendMail = async mailData => {
    if (this.mailer === null) {
      await this.createTransport();
    }

    mailData.subject = SUBJECT_PREFIX + (mailData.subject || '');
    const result = await this.mailer.sendMail(mailData);
    return {
      result,
      mailData: { ...this.defMailSet, ...mailData }
    };
  };

  this.constructFrom = constructFrom;
};
