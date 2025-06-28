module.exports = {
  development: {
    database: 0,
    host: 'redis'
  },
  test: {
    database: 1,
    host: 'redis'
  },
  staging: {
    database: process.env.GVN_REDIS_DATABASE,
    host: process.env.GVN_REDIS_HOST
  },
  production: {
    database: process.env.GVN_REDIS_DATABASE,
    host: process.env.GVN_REDIS_HOST
  }
};
