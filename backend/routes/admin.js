const SCOPES = require('../../enums/adminScopes').default;

module.exports = function(fastify, opts, next) {
  fastify.register(
    function(fastify, opts, next) {
      fastify.post('/issue', {
        config: { isAdmin: true },
        schema: require('../schema/common/access_token/issue'),
        handler: require('../controllers/common/access_token/issue')
      });

      fastify.post('/check', {
        config: { isAdmin: true },
        schema: require('../schema/common/access_token/check'),
        handler: require('../controllers/common/access_token/check')
      });

      next();
    },
    { prefix: '/access_token' }
  );

  // require access token
  fastify.register(function(fastify, opts, next) {
    fastify.register(require('../plugins/accessTokenAndScope'), {
      isAdmin: true
    });

    fastify.register(
      function(fastify, opts, next) {
        fastify.patch('/change_password', {
          config: { scopes: [SCOPES.CHANGE_PSWD] },
          schema: require('../schema/admin/admin_user/change_password'),
          handler: require('../controllers/admin/admin_user/change_password')
        });

        fastify.get('/list', {
          config: { scopes: [SCOPES.OBTAIN_USER_LIST] },
          handler: require('../controllers/admin/admin_user/list')
        });

        next();
      },
      { prefix: '/admin_user' }
    );

    fastify.register(
      function(fastify, opts, next) {
        fastify.get('/list', {
          config: { scopes: [SCOPES.LIST, SCOPES.GROUP, SCOPES.GROUP_INF] },
          handler: require('../controllers/admin/list/list')
        });

        fastify.put('/save', {
          config: { scopes: [SCOPES.LIST] },
          schema: require('../schema/admin/list/save'),
          handler: require('../controllers/admin/list/save')
        });

        fastify.delete('/:listid', {
          config: { scopes: [SCOPES.LIST] },
          handler: require('../controllers/admin/list/delete')
        });

        fastify.patch('/:listid/user_form/enable', {
          config: { scopes: [SCOPES.LIST] },
          handler: require('../controllers/admin/list/enable')
        });

        fastify.patch('/:listid/user_form/disable', {
          config: { scopes: [SCOPES.LIST] },
          handler: require('../controllers/admin/list/disable')
        });

        fastify.get('/:listid/groups', {
          config: { scopes: [SCOPES.GROUP, SCOPES.GROUP_INF] },
          handler: require('../controllers/admin/list/get_group_list')
        });

        fastify.post('/:listid/groups/bulk_register', {
          config: { scopes: [SCOPES.GROUP] },
          schema: require('../schema/admin/list/group_bulk_register'),
          handler: require('../controllers/admin/list/group_bulk_register')
        });

        next();
      },
      { prefix: '/list' }
    );

    fastify.register(
      function(fastify, opts, next) {
        fastify.put('/modify', {
          config: { scopes: [SCOPES.GROUP] },
          schema: require('../schema/admin/group/modify'),
          handler: require('../controllers/admin/group/modify')
        });

        fastify.delete('/:groupId', {
          config: { scopes: [SCOPES.GROUP] },
          handler: require('../controllers/admin/group/delete')
        });

        fastify.get('/download_csv', {
          handler: require('../controllers/admin/group/download-csv')
        });

        next();
      },
      { prefix: '/group' }
    );

    fastify.register(
      function(fastify, opts, next) {
        fastify.post('/send', {
          config: { scopes: [SCOPES.MAIL] },
          schema: require('../schema/admin/mail/send'),
          handler: require('../controllers/admin/mail/send')
        });

        next();
      },
      { prefix: '/mail' }
    );

    fastify.register(
      function(fastify, opts, next) {
        fastify.get('/', {
          config: {
            scopes: [SCOPES.SENT_MAIL_HISTORY, SCOPES.SENT_MAIL_HISTORY_INF]
          },
          schema: require('../schema/admin/mail_history/list'),
          handler: require('../controllers/admin/mail_history/list')
        });

        fastify.get('/:sentMailId', {
          config: {
            scopes: [SCOPES.SENT_MAIL_HISTORY, SCOPES.SENT_MAIL_HISTORY_INF]
          },
          handler: require('../controllers/admin/mail_history/get')
        });

        next();
      },
      { prefix: '/mail_history' }
    );

    fastify.register(
      function(fastify, opts, next) {
        fastify.get('/', {
          config: { scopes: [SCOPES.USER] },
          handler: require('../controllers/admin/user/list')
        });

        fastify.put('/save', {
          config: { scopes: [SCOPES.USER] },
          schema: require('../schema/admin/user/save'),
          handler: require('../controllers/admin/user/save')
        });

        fastify.delete('/:userId', {
          config: { scopes: [SCOPES.USER] },
          handler: require('../controllers/admin/user/delete')
        });

        next();
      },
      { prefix: '/user' }
    );

    fastify.register(
      function(fastify, opts, next) {
        fastify.get('/', {
          config: { scopes: [SCOPES.SEND_MAIL_SETTING] },
          handler: require('../controllers/admin/send_mail_setting/list')
        });

        fastify.put('/save', {
          config: { scopes: [SCOPES.SEND_MAIL_SETTING] },
          schema: require('../schema/admin/send_mail_setting/save'),
          handler: require('../controllers/admin/send_mail_setting/save')
        });

        next();
      },
      { prefix: '/send_mail_setting' }
    );

    fastify.register(
      function(fastify, opts, next) {
        fastify.get('/', {
          config: {
            scopes: [
              SCOPES.MAIL_TEMPLATE,
              SCOPES.SENT_MAIL_HISTORY,
              SCOPES.SENT_MAIL_HISTORY_INF
            ]
          },
          handler: require('../controllers/admin/mail_template/list')
        });

        fastify.put('/save', {
          config: { scopes: [SCOPES.MAIL_TEMPLATE] },
          schema: require('../schema/admin/mail_template/save'),
          handler: require('../controllers/admin/mail_template/save')
        });

        next();
      },
      { prefix: '/mail_template' }
    );

    fastify.register(
      function(fastify, opts, next) {
        fastify.get('/', require('../controllers/common/building/list'));
        next();
      },
      { prefix: '/building' }
    );

    fastify.register(
      function(fastify, opts, next) {
        fastify.get('/', {
          config: { scopes: [SCOPES.API_TOKEN] },
          handler: require('../controllers/admin/api_token/get')
        });
        fastify.post('/generate', {
          config: { scopes: [SCOPES.API_TOKEN] },
          handler: require('../controllers/admin/api_token/generate')
        });
        next();
      },
      { prefix: '/api_token' }
    );

    next();
  });

  next();
};
