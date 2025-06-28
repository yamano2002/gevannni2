module.exports = function(fastify, opts, next) {
  fastify.register(
    function(fastify, opts, next) {
      fastify.post('/issue', {
        config: { isAdmin: false },
        schema: require('../schema/common/access_token/issue'),
        handler: require('../controllers/common/access_token/issue')
      });

      fastify.post('/check', {
        config: { isAdmin: false },
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
      isAdmin: false
    });

    fastify.register(
      function(fastify, opts, next) {
        fastify.get('/', require('../controllers/user/list/list'));

        fastify.get('/:tag', require('../controllers/user/list/get'));
        next();
      },
      { prefix: '/list' }
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
        fastify.post('/issue', {
          schema: require('../schema/user/auth_code/issue'),
          handler: require('../controllers/user/auth_code/issue')
        });
        next();
      },
      { prefix: '/auth_code' }
    );

    fastify.register(
      function(fastify, opts, next) {
        fastify.post('/issue', {
          schema: require('../schema/user/modify_token/issue'),
          handler: require('../controllers/user/modify_token/issue')
        });
        next();
      },
      { prefix: '/modify_token' }
    );

    fastify.register(
      function(fastify, opts, next) {
        fastify.put('/register', {
          schema: require('../schema/user/group/register'),
          handler: require('../controllers/user/group/register')
        });
        next();
      },
      { prefix: '/group' }
    );

    next();
  });

  next();
};
