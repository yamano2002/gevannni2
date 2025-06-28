'use strict';

const SEND_MAIL_SETTING_TAG = require('../../enums/sendMailSettingTag').default;
const mailTmpLoader = require('../../assets/mail/init-templates/loader');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'SendMailSettings',
      [
        {
          id: 1,
          name: 'メール下部署名',
          tag: SEND_MAIL_SETTING_TAG.MAIL_FOOTER_SIGN,
          description: '送信メール下部に記載される署名欄',
          form_type: 'textarea',
          value: JSON.stringify(mailTmpLoader('footer-sign'))
        },
        {
          id: 2,
          name: '問い合わせ先メールアドレス',
          tag: SEND_MAIL_SETTING_TAG.INQUIRY_ADDRESS,
          description: '問い合わせ先メールアドレス',
          form_type: 'email',
          value: JSON.stringify('inquiry@example.com')
        },
        {
          id: 3,
          name: '運営組織名',
          tag: SEND_MAIL_SETTING_TAG.ORGANIZATION_NAME,
          description: '運営組織名',
          form_type: 'text',
          value: JSON.stringify('駒場幸福委員会')
        },
        {
          id: 4,
          name: '差出人アドレスドメイン',
          tag: SEND_MAIL_SETTING_TAG.FROM_ADDRESS_DOMAIN,
          description: '送信メールの差出人アドレスのドメイン (@より後の部分)',
          form_type: 'text',
          value: JSON.stringify('example.com')
        },
        {
          id: 5,
          name: 'デフォルト差出人名',
          tag: SEND_MAIL_SETTING_TAG.DEFAULT_FROM_NAME,
          description: '送信メールのデフォルトの差出人名',
          form_type: 'text',
          value: JSON.stringify('駒場幸福委員会')
        },
        {
          id: 6,
          name: 'デフォルト差出人アドレス Local Part',
          tag: SEND_MAIL_SETTING_TAG.DEFAULT_FROM_ADDRESS_LOCAL_PART,
          description:
            '送信メールのデフォルトの差出人アドレスの Local Part (@より前の部分)',
          form_type: 'text',
          value: JSON.stringify('info')
        },
        {
          id: 7,
          name: 'デフォルト返信先アドレス',
          tag: SEND_MAIL_SETTING_TAG.DEFAULT_REPLY_ADDRESS,
          description: '送信メールのデフォルトの返信先アドレス',
          form_type: 'email',
          value: JSON.stringify(null)
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('SendMailSettings', null, {});
  }
};
