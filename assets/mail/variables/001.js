const MAIL_TMP_TAG = require('../../../enums/mailTmpTag');

module.exports = {
  // 新規登録
  [MAIL_TMP_TAG.GROUP_REGISTER_ADD]: {
    form: 'リスト名',
    group: '団体名',
    charge: '担当者名',
    id: '団体ID',
    mail: '担当者アドレス',
    addr_question: '問い合わせ先アドレス',
    name_org: '組織名'
  },

  // 年度内変更
  [MAIL_TMP_TAG.GROUP_REGISTER_MODIFY]: {
    form: 'リスト名',
    group: '団体名',
    charge_former: '前担当者名',
    charge_latter: '新担当者名',
    id: '団体ID',
    mail_former: '前担当者アドレス',
    mail_latter: '新担当者アドレス',
    addr_question: '問い合わせ先アドレス',
    name_org: '組織名'
  },

  // 団体登録画面認証コード
  [MAIL_TMP_TAG.AUTH_CODE]: {
    auth_code: '認証コード',
    code_exp_min: '認証コード有効期限 (分)',
    addr_question: '問い合わせ先アドレス',
    name_org: '組織名'
  },

  // 一般メーリステンプレート
  [MAIL_TMP_TAG.MAILING_LIST_TMP]: {
    form: 'リスト名',
    group: '団体名',
    charge: '担当者名',
    id: '団体ID',
    mail: '担当者アドレス',
    name_org: '組織名'
  }
};
