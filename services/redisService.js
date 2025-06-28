const env = process.env.NODE_ENV || 'development';
const config = require('../config/redis')[env];
const Redis = require('ioredis');

module.exports = new Redis({
  host: config.host,
  db: config.database
});
