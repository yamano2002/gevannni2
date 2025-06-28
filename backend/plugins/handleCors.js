const fp = require('fastify-plugin');
const env = process.env.NODE_ENV || 'development';
const httpConfig = require('../../config/http')[env];

function generateAllowOrigin(reqHeaders) {
  if (!reqHeaders.hasOwnProperty('origin')) {
    throw new Error('Origin header is missing.');
  }

  const origin = reqHeaders.origin;
  const isContain = httpConfig.backend.allowOrigin.some(
    host => origin.indexOf(host) > -1
  );
  if (!isContain) {
    throw new Error('Request origin is not allowed.');
  }

  return origin;
}

function handleCors(fastify, opts, next) {
  fastify.addHook('onSend', (request, reply, payload, next) => {
    let allowOrigin = '';
    try {
      allowOrigin = generateAllowOrigin(request.headers);
    } catch (e) {
      next(null, payload);
      return;
    }

    reply
      .header('Access-Control-Allow-Origin', allowOrigin)
      .header('Access-Control-Allow-Headers', 'Content-Type, authorization')
      .header(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, PATCH, OPTIONS'
      );
    next(null, payload);
  });

  fastify.options('/*', (request, reply) => {
    reply.send();
  });

  next();
}

module.exports = fp(handleCors);
