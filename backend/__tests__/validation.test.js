const { isValidEmail, isValidPassword, isValidName } = require('../src/utils/validation');

describe('isValidEmail', () => {
  test('повертає true для коректних адрес', () => {
    expect(isValidEmail('test@test.com')).toBe(true);
    expect(isValidEmail('user.name@example.co.uk')).toBe(true);
    expect(isValidEmail('admin@codequest.local')).toBe(true);
    expect(isValidEmail('a@b.cd')).toBe(true);
  });

  test('повертає false для адрес без символу @', () => {
    expect(isValidEmail('plaintext')).toBe(false);
    expect(isValidEmail('user.test.com')).toBe(false);
  });

  test('повертає false для адрес без локальної частини', () => {
    expect(isValidEmail('@nodomain.com')).toBe(false);
  });

  test('повертає false для адрес без домену', () => {
    expect(isValidEmail('user@')).toBe(false);
    expect(isValidEmail('user@.com')).toBe(false);
  });

  test('повертає false для адрес з пробілами', () => {
    expect(isValidEmail('user @test.com')).toBe(false);
    expect(isValidEmail('user@ test.com')).toBe(false);
    expect(isValidEmail(' user@test.com')).toBe(false);
  });

  test('повертає false для порожнього рядка', () => {
    expect(isValidEmail('')).toBe(false);
  });

  test('повертає false для нерядкових типів', () => {
    expect(isValidEmail(null)).toBe(false);
    expect(isValidEmail(undefined)).toBe(false);
    expect(isValidEmail(123)).toBe(false);
    expect(isValidEmail({})).toBe(false);
  });
});

describe('isValidPassword', () => {
  test('повертає true для паролів довжиною 8 і більше символів', () => {
    expect(isValidPassword('password')).toBe(true);
    expect(isValidPassword('12345678')).toBe(true);
    expect(isValidPassword('verylongpasswordwithmanycharacters')).toBe(true);
  });

  test('повертає false для паролів коротших за 8 символів', () => {
    expect(isValidPassword('')).toBe(false);
    expect(isValidPassword('1')).toBe(false);
    expect(isValidPassword('short')).toBe(false);
    expect(isValidPassword('1234567')).toBe(false);
  });

  test('повертає false для нерядкових типів', () => {
    expect(isValidPassword(null)).toBe(false);
    expect(isValidPassword(undefined)).toBe(false);
    expect(isValidPassword(12345678)).toBe(false);
  });
});

describe('isValidName', () => {
  test('повертає true для імен довжиною 2 і більше символів', () => {
    expect(isValidName('Іван')).toBe(true);
    expect(isValidName('John Doe')).toBe(true);
    expect(isValidName('Ax')).toBe(true);
    expect(isValidName('Адміністратор')).toBe(true);
  });

  test('обрізає пробіли по краях перед перевіркою довжини', () => {
    expect(isValidName('  Im  ')).toBe(true);
    expect(isValidName(' Ax ')).toBe(true);
  });

  test('повертає false для імен коротших за 2 символи', () => {
    expect(isValidName('')).toBe(false);
    expect(isValidName('a')).toBe(false);
    expect(isValidName(' ')).toBe(false);
    expect(isValidName('     ')).toBe(false);
  });

  test('повертає false для нерядкових типів', () => {
    expect(isValidName(null)).toBe(false);
    expect(isValidName(undefined)).toBe(false);
    expect(isValidName(123)).toBe(false);
  });
});
