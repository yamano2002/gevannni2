const { promisify } = require('util');
const MailDev = require('maildev');
const sleep = require('../../services/asyncSleepService').default;

const maildev = new MailDev({
  smtp: 1025
});

const _getAllEmail = promisify(maildev.getAllEmail);

module.exports = {
  listen: maildev.listen,
  close: maildev.close,
  getAllEmail: async () => {
    await sleep(500);
    return await _getAllEmail();
  },
  deleteAllEmail: promisify(maildev.deleteAllEmail)
};
