const nanoid = require('nanoid/async');
const cryptSrv = require('../cryptService');
const redisSrv = require('../redisService');
const appConfig = require('../../config/app').default;

const REDIS_KEY_PREFIX = 'gvn2-usr-group-modify-token:';
const REDIS_HASH_FIELDS = {
  LIST_TAG: 'list-tag',
  GROUP_ID_PUB: 'group-id-pub'
};

function genRedisKey(modifyToken) {
  const modifyTokenCrypt = cryptSrv.encrypt(modifyToken);
  return REDIS_KEY_PREFIX + modifyTokenCrypt;
}

module.exports = {
  issue: async (listTag, groupIdPub) => {
    // generate token (random string)
    const modifyToken = await nanoid(appConfig.GROUP_MODIFY_TOKEN_LENGTH);

    // store token info in Redis
    const key = genRedisKey(modifyToken);
    await redisSrv
      .multi()
      .hmset(
        key,
        REDIS_HASH_FIELDS.LIST_TAG,
        listTag,
        REDIS_HASH_FIELDS.GROUP_ID_PUB,
        groupIdPub
      )
      .expire(key, appConfig.REDIS_GROUP_MODIFY_TOKEN_EXPIRATION)
      .exec();

    return modifyToken;
  },
  verify: async (listTag, groupIdPub, modifyToken) => {
    const key = genRedisKey(modifyToken);
    const values = await redisSrv.hgetall(key);

    // empty result
    if (Object.keys(values).length === 0) {
      return false;
    }

    return (
      values[REDIS_HASH_FIELDS.LIST_TAG] === listTag &&
      Number(values[REDIS_HASH_FIELDS.GROUP_ID_PUB]) === groupIdPub
    );
  },
  deleteToken: async modifyToken => {
    const key = genRedisKey(modifyToken);
    await redisSrv.del(key);
  }
};
