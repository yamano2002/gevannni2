import SCOPE from '../../enums/adminScopes';

export default [
  {
    href: '/',
    label: 'ダッシュボード',
    icon: 'dashboard'
  },
  {
    href: '/lists',
    label: 'リスト',
    icon: 'fa-th-list',
    scopes: [SCOPE.LIST]
  },
  {
    href: '/group',
    label: '登録団体',
    icon: 'fa-users',
    scopes: [SCOPE.GROUP, SCOPE.GROUP_INF]
  },
  {
    href: '/mail_history',
    label: 'メール送信履歴',
    icon: 'fa-history',
    scopes: [SCOPE.SENT_MAIL_HISTORY, SCOPE.SENT_MAIL_HISTORY_INF]
  },
  {
    href: '/mail_template',
    label: 'メールテンプレート',
    icon: 'fa-mail-bulk',
    scopes: [SCOPE.MAIL_TEMPLATE]
  },
  {
    href: '/send_mail_setting',
    label: 'メール送信設定',
    icon: 'fa-toolbox',
    scopes: [SCOPE.SEND_MAIL_SETTING]
  },
  {
    href: '/settings',
    label: '設定',
    icon: 'settings',
    scopes: [SCOPE.SETTINGS]
  }
];
