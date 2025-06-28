let adminConfig = require('./nuxt.common');

adminConfig.srcDir = 'front-admin';
adminConfig.buildDir = '.nuxt/front-admin';
adminConfig.server = {
  port: 3001,
  host: '0.0.0.0'
};
adminConfig.generate = {
  dir: 'dist/front-admin'
};
adminConfig.router = {
  middleware: 'authenticated'
};
adminConfig.axios.baseURL += '/adm';

module.exports = adminConfig;
