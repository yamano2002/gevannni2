const env = require('../utilities/getNodeEnv').ENV;
const appNameEnvSuffix = env !== 'production' ? ` (${env})` : '';

export default {
  APP_NAME_USER: '学生会館 団体登録システム' + appNameEnvSuffix,

  APP_NAME_ADMIN: 'Lists management system【Gevanni.】' + appNameEnvSuffix,

  DEV_API_BACKDOOR_HEADER: 'gevanni-backend-dev-backdoor',

  /**
   * unit: second
   */
  REDIS_ACCESS_TOKEN_EXPIRATION: 15 * 60,

  ACCESS_TOKEN_LENGTH: 128,

  /**
   * unit: second
   */
  REDIS_GROUP_MODIFY_TOKEN_EXPIRATION: 20 * 60,

  GROUP_MODIFY_TOKEN_LENGTH: 128,

  // unit: minute
  REDIS_USER_MAIL_AUTH_CODE_EXPIRATION: 15,

  USER_MAIL_AUTH_CODE_LENGTH: 4,

  GROUP_ID_PUB_DIGIT_NUM: 4,

  API_TOKEN_LENGTH: 128,

  CRYPTO: {
    KEY: 'EVlLfddzflRBwp5dty2icrsiPqSMHaDh',
    IV: 'OLAk_gq-6QlMrgSo',
    ALGORITHM: 'aes-256-cbc'
  }
};
