const nanoid = require('nanoid/async/generate');
const cryptSrv = require('../cryptService');
const redisSrv = require('../redisService');
const appConfig = require('../../config/app').default;

const REDIS_KEY_PREFIX = 'gvn2-usr-mail-auth-code';

function genRedisKey(listTag, mail) {
  const mailCrypt = cryptSrv.encrypt(mail);
  return `${REDIS_KEY_PREFIX}:${listTag}:${mailCrypt}`;
}

module.exports = {
  issue: async (listTag, mail) => {
    // generate random auth code (consists of only numbers)
    const authCode = await nanoid(
      '1234567890',
      appConfig.USER_MAIL_AUTH_CODE_LENGTH
    );

    // store token info in Redis
    const key = genRedisKey(listTag, mail);
    const exp_sec = appConfig.REDIS_USER_MAIL_AUTH_CODE_EXPIRATION * 60;
    await redisSrv.setex(key, exp_sec, authCode);

    return authCode;
  },
  verify: async (listTag, mail, authCode) => {
    const key = genRedisKey(listTag, mail);
    const value = await redisSrv.get(key);

    return authCode === value;
  },
  deleteCode: async (listTag, mail) => {
    const key = genRedisKey(listTag, mail);
    await redisSrv.del(key);
  }
};
