module.exports = () => {
  const fastify = require('fastify')({
    logger: true
  });

  fastify.register(require('./routes/'));

  return fastify;
};
