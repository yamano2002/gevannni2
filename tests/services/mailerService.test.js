const mailerSrv = require('../../services/mailerService');
const mailCatcher = require('../test-utilities/mailCatcher');

const mailData = {
  from: '学生会館運営委員会 <foo@example.com>',
  to: 'bar@example.com, baz@example.com',
  subject: '学館だよー ✔',
  text: '閉館時間を守ろう！',
  html: '<b>持ち逃げやめて！！</b>'
};

describe('services/mailerService', () => {
  beforeAll(() => {
    mailCatcher.listen();
  });

  afterEach(async () => {
    await mailCatcher.deleteAllEmail();
  });

  afterAll(() => {
    mailCatcher.close();
  });

  test('verify mailerService behavior', async () => {
    const mailer = new mailerSrv();
    const sentInfo = await mailer.sendMail(mailData);

    const sentMails = await mailCatcher.getAllEmail();
    expect(sentMails.length).toBeGreaterThan(0);

    const sentMail = sentMails[0];
    expect(sentMail.headers.from).toBe(mailData.from);
    expect(sentMail.headers.to).toBe(mailData.to);
    expect(sentMail.headers.subject).toBe(mailData.subject);
    expect(sentMail.headers['message-id']).toBe(sentInfo.result.messageId);
    expect(sentMail.text).toBe(mailData.text);
    expect(sentMail.html).toBe(mailData.html);
  });
});
