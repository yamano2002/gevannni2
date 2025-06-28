const bcrypt = require('bcrypt');

module.exports = {
  genHash: (text, saltRounds = 10) =>
    new Promise((resolve, reject) => {
      bcrypt.hash(text, saltRounds, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    }),

  verify: (plain, hashed) =>
    new Promise(async (resolve, reject) => {
      const isEqual = await bcrypt.compare(plain, hashed).catch(err => {
        reject(err);
      });
      resolve(isEqual);
    })
};
