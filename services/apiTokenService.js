const nanoid = require('nanoid/async');
const cryptSrv = require('./cryptService');
const appConfig = require('../config/app').default;
const { SystemSetting } = require('../db/models');

const DB_KEY = 'api-token-crypt';

module.exports = {
  get: async () => {
    const apiTokenCrypt = await SystemSetting.get(DB_KEY);
    return apiTokenCrypt ? cryptSrv.decrypt(apiTokenCrypt) : null;
  },

  generate: async () => {
    const apiToken = await nanoid(appConfig.API_TOKEN_LENGTH);
    await SystemSetting.set(DB_KEY, cryptSrv.encrypt(apiToken));
    return apiToken;
  },

  delete: () => {
    return SystemSetting.deleteKey(DB_KEY);
  }
};
