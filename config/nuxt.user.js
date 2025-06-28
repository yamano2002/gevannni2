let userConfig = require('./nuxt.common');

userConfig.srcDir = 'front-user';
userConfig.buildDir = '.nuxt/front-user';
userConfig.server = {
  port: 3002,
  host: '0.0.0.0'
};
userConfig.generate = {
  dir: 'dist/front-user'
};
userConfig.router = {
  middleware: ['authenticated', 'groupRegisterCheckPhase']
};

module.exports = userConfig;
