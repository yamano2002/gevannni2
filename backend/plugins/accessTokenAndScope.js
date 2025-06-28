const fp = require('fastify-plugin');
const httpError = require('http-errors');
const CONFIG = require('../../config/app').default;
const tokenSrv = require('../../services/accessTokenService');
const env = process.env.NODE_ENV || 'development';

function checkScope(userScopes, requiredScopes = []) {
  if (!requiredScopes) return true;

  if (!Array.isArray(requiredScopes)) {
    requiredScopes = [requiredScopes];
  }

  if (requiredScopes.length < 1) {
    return true;
  }

  return userScopes.some(val => requiredScopes.indexOf(val) > -1);
}

function accessTokenAndScope(fastify, opts, next) {
  fastify.decorateRequest('auth', {});

  fastify.decorateRequest('checkScope', (request, requiredScopes = []) => {
    if (!request.auth) {
      return false;
    }

    if (env === 'development' && request.auth.backdoor) {
      return true;
    }

    const userScopes = request.auth.scopes;
    return checkScope(userScopes, requiredScopes);
  });

  fastify.addHook('preHandler', async (request, reply) => {
    const headers = request.headers;

    // if `Gevanni-Admin-Dev-Backdoor` header exists, no access token or scope is required
    // only for development environment
    if (env === 'development') {
      if (headers[CONFIG.DEV_API_BACKDOOR_HEADER]) {
        request.auth = {
          backdoor: true
        };
        return;
      }
    }

    // missing access token
    if (typeof headers.authorization === 'undefined') {
      throw new httpError.Unauthorized('Access token is missing.');
    }

    const isAdmin = opts.isAdmin || false;

    const accessToken = headers.authorization.slice(7); // discard 'Bearer '
    const userInfo = await tokenSrv.retrieveUserInfo(accessToken, isAdmin);
    // invalid access token
    if (userInfo === null) {
      throw new httpError.Unauthorized('Invalid access token.');
    }

    // check scope
    const requiredScopes = reply.context.config.scopes;
    if (!checkScope(userInfo.scopes, requiredScopes)) {
      throw new httpError.Forbidden('Forbidden action for your scopes.');
    }

    // store scopes of requesting user
    request.auth = {
      scopes: userInfo.scopes
    };
  });

  next();
}

module.exports = fp(accessTokenAndScope);
