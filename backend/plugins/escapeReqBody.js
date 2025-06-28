const fp = require('fastify-plugin');
const escapeHSpChars = require('../../utilities/escapeHSpChars');

function escapeReqBody(fastify, opts, next) {
  fastify.addHook('preHandler', (request, reply, next) => {
    request.body = escapeHSpChars(request.body);
    next();
  });
  next();
}

module.exports = fp(escapeReqBody);
