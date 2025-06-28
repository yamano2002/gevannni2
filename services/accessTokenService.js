const nanoid = require('nanoid/async');
const redisSrv = require('./redisService');
const cryptSrv = require('./cryptService');
const appConfig = require('../config/app').default;

const REDIS_KEY_PREFIX_ADMIN = 'gvn2-adm-acc-tkn:';
const REDIS_KEY_PREFIX_USER = 'gvn2-usr-acc-tkn:';
const REDIS_HASH_FIELDS = {
  USERNAME: 'username',
  SCOPES: 'scopes'
};

function genRedisKey(accessToken, isAdmin = false) {
  const accessTokenCrypt = cryptSrv.encrypt(accessToken);
  const prefix = isAdmin ? REDIS_KEY_PREFIX_ADMIN : REDIS_KEY_PREFIX_USER;
  return prefix + accessTokenCrypt;
}

async function prolongExpTime(accessToken, isAdmin = false) {
  const key = genRedisKey(accessToken, isAdmin);
  await redisSrv.expire(key, appConfig.REDIS_ACCESS_TOKEN_EXPIRATION);
}

module.exports = {
  issueAndStoreRedis: async (username, scopes = [], isAdmin = false) => {
    // generate token (random string)
    const accessToken = await nanoid(appConfig.ACCESS_TOKEN_LENGTH);

    // store token info in Redis
    const key = genRedisKey(accessToken, isAdmin);
    await redisSrv
      .multi()
      .hmset(
        key,
        REDIS_HASH_FIELDS.USERNAME,
        username,
        REDIS_HASH_FIELDS.SCOPES,
        JSON.stringify(scopes)
      )
      .expire(key, appConfig.REDIS_ACCESS_TOKEN_EXPIRATION)
      .exec();

    return accessToken;
  },

  /**
   * If `_isAdmin` is false, it attempts to get general user token firstly and admin user secondly
   */
  retrieveUserInfo: async (
    accessToken,
    _isAdmin = false,
    prlExpTime = true
  ) => {
    const isAdminArr = _isAdmin ? [true] : [false, true];

    for (const isAdmin of isAdminArr) {
      const key = genRedisKey(accessToken, isAdmin);
      const userInfo = await redisSrv.hgetall(key);

      // empty result
      if (Object.keys(userInfo).length === 0) {
        continue;
      }

      // prolong expiration time of access token
      if (prlExpTime) {
        await prolongExpTime(accessToken, isAdmin);
      }

      return {
        username: userInfo[REDIS_HASH_FIELDS.USERNAME],
        scopes: JSON.parse(userInfo[REDIS_HASH_FIELDS.SCOPES])
      };
    }

    // no user token found
    return null;
  },

  prolongExpTime: prolongExpTime
};
