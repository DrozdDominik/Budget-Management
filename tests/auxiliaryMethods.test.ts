import { it, expect, describe } from 'vitest';
import {
  isEmailValid,
  isPasswordValid,
  trimAndChangeFirstLetterToUppercaseAndOtherToLowercase,
} from '../utils/auxiliaryMethods';

describe('isPasswordValid()', () => {
  it('should returns false if provided password is to short', () => {
    const notValidPassword = '123456';

    const result = isPasswordValid(notValidPassword);

    expect(result).toBe(false);
  });

  it('should returns false if provided password has no digits', () => {
    const notValidPassword = 'qwertyui*';

    const result = isPasswordValid(notValidPassword);

    expect(result).toBe(false);
  });

  it('should returns false if provided password has no special character', () => {
    const notValidPassword = 'qwertyui5';

    const result = isPasswordValid(notValidPassword);

    expect(result).toBe(false);
  });

  it('should returns true if provided valid password', () => {
    const validEmail = 'asdf1uuah&hy';

    const result = isPasswordValid(validEmail);

    expect(result).toBe(true);
  });
});

describe('isEmailValid()', () => {
  it('should returns false if provided not valid email', () => {
    const notValidEmail = 'test.pl';

    const result = isEmailValid(notValidEmail);

    expect(result).toBe(false);
  });

  it('should returns true if provided valid email', () => {
    const validEmail = 'test@example.pl';

    const result = isEmailValid(validEmail);

    expect(result).toBe(true);
  });
});

describe('trimAndChangeFirstLetterToUppercaseAndOtherToLowercase()', () => {
  it('should trim and make first letter uppercase and rest of letters lowercase', () => {
    const testName = '  teStOwA ';

    const result =
      trimAndChangeFirstLetterToUppercaseAndOtherToLowercase(testName);

    expect(result).toBe('Testowa');
  });
});