const crypto = require('crypto');
const appConfig = require('../config/app').default;
const key = Buffer.from(appConfig.CRYPTO.KEY, 'utf8');
const iv = Buffer.from(appConfig.CRYPTO.IV, 'utf8');
const algorithm = appConfig.CRYPTO.ALGORITHM;

module.exports = {
  encrypt: plain => {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encoded = cipher.update(plain, 'utf8', 'hex');
    encoded += cipher.final('hex');
    return encoded;
  },

  decrypt: crypt => {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decoded = decipher.update(crypt, 'hex', 'utf8');
    decoded += decipher.final('utf8');
    return decoded;
  }
};
