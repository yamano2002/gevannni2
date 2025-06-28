module.exports = function(fastify, opts, next) {
  fastify.register(require('../plugins/handleCors'));
  fastify.register(require('../plugins/escapeReqBody'));
  fastify.register(require('./user'));
  fastify.register(require('./admin'), { prefix: '/adm' });
  fastify.register(require('./api'), { prefix: '/api' });
  next();
};
