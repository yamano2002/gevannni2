const cryptSrv = require('../../services/cryptService');

describe('services/cryptService', () => {
  test('verify encrypt and decrypt behavior', () => {
    const textPlain = 'some_text_2_verify';
    const textCrypt = cryptSrv.encrypt(textPlain);
    const textDecrypt = cryptSrv.decrypt(textCrypt);
    expect(textDecrypt).toBe(textPlain);
  });
});
