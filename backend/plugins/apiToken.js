const fp = require('fastify-plugin');
const httpError = require('http-errors');
const CONFIG = require('../../config/app').default;
const apiTokenSrv = require('../../services/apiTokenService');
const env = process.env.NODE_ENV || 'development';

function apiToken(fastify, opts, next) {
  fastify.addHook('preHandler', async (request, reply) => {
    const headers = request.headers;

    // if `Gevanni-Admin-Dev-Backdoor` header exists, no access token or scope is required
    // only for development environment
    if (env === 'development') {
      if (headers[CONFIG.DEV_API_BACKDOOR_HEADER]) {
        return;
      }
    }

    // missing access token
    if (typeof headers.authorization === 'undefined') {
      throw new httpError.NotFound();
    }

    const tokenInRequest = headers.authorization.slice(7); // discard 'Bearer '
    const validToken = await apiTokenSrv.get();
    // invalid access token
    if (tokenInRequest !== validToken) {
      throw new httpError.NotFound();
    }
  });

  next();
}

module.exports = fp(apiToken);
