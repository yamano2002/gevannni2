require('@babel/register');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/http')[env];

const server = require('./bootstrap')();

const start = async () => {
  try {
    await server.listen(config.backend.port, '0.0.0.0');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
