const passwordSrv = require('../../services/passwordService');

describe('services/passwordService', () => {
  test('verify password match', async () => {
    const passwordPlain = 'correctPassword';
    const passwordHashed = await passwordSrv.genHash(passwordPlain);
    const result = await passwordSrv.verify(passwordPlain, passwordHashed);
    expect(result).toBeTruthy();
  });

  test('verify password miss match', async () => {
    const passwordPlain = 'correctPassword';
    const passwordHashed = await passwordSrv.genHash(passwordPlain);
    const result = await passwordSrv.verify('wrongPassword', passwordHashed);
    expect(result).toBeFalsy();
  });
});
