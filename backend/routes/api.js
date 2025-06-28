module.exports = function(fastify, opts, next) {
  // check token
  fastify.register(require('../plugins/apiToken'));

  fastify.get(
    '/group/list_csv/:listTag',
    require('../controllers/api/group/list_csv')
  );

  next();
};
