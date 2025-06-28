'use strict';

const MAIL_TMP_TAG = require('../../enums/mailTmpTag');
const mailTmpLoader = require('../../assets/mail/init-templates/loader');
const mailVarLoader = require('../../assets/mail/variables/loader');

const variableVersion = 1;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'MailTemplates',
      [
        {
          id: 1,
          name: '団体新規登録完了',
          tag: MAIL_TMP_TAG.GROUP_REGISTER_ADD,
          description: '新規登録完了時に送信されるメール',
          from_address_name: '学生会館・キャンパスプラザ 団体登録システム',
          from_address_local_part: 'register',
          subject: '【学生会館・キャンパスプラザ】団体新規登録完了のお知らせ',
          body: mailTmpLoader(MAIL_TMP_TAG.GROUP_REGISTER_ADD),
          variables: mailVarLoader(
            variableVersion,
            MAIL_TMP_TAG.GROUP_REGISTER_ADD
          )
        },
        {
          id: 2,
          name: '団体年度内変更登録完了',
          tag: MAIL_TMP_TAG.GROUP_REGISTER_MODIFY,
          description: '年度内変更完了時に送信されるメール',
          from_address_name: '学生会館・キャンパスプラザ 団体登録システム',
          from_address_local_part: 'register',
          subject:
            '【学生会館・キャンパスプラザ】団体年度内変更登録完了のお知らせ',
          body: mailTmpLoader(MAIL_TMP_TAG.GROUP_REGISTER_MODIFY),
          variables: mailVarLoader(
            variableVersion,
            MAIL_TMP_TAG.GROUP_REGISTER_MODIFY
          )
        },
        {
          id: 3,
          name: '認証コード発行',
          tag: MAIL_TMP_TAG.AUTH_CODE,
          description:
            '団体登録前にメールアドレス認証のためのコードを付与したメール',
          from_address_name: '学生会館・キャンパスプラザ 団体登録システム',
          from_address_local_part: 'register',
          subject: '【学生会館・キャンパスプラザ】認証コードのお知らせ',
          body: mailTmpLoader(MAIL_TMP_TAG.AUTH_CODE),
          variables: mailVarLoader(variableVersion, MAIL_TMP_TAG.AUTH_CODE)
        },
        {
          id: 4,
          name: 'メーリステンプレート',
          tag: MAIL_TMP_TAG.MAILING_LIST_TMP,
          description: 'メーリングリストのテンプレート',
          from_address_name: '学生会館運営委員会',
          from_address_local_part: 'info',
          subject: '【学生会館・キャンパスプラザ】',
          body: mailTmpLoader(MAIL_TMP_TAG.MAILING_LIST_TMP),
          variables: mailVarLoader(
            variableVersion,
            MAIL_TMP_TAG.MAILING_LIST_TMP
          )
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('MailTemplates', null, {});
  }
};
