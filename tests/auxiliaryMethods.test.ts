import { it, expect, describe } from 'vitest';
import { isPasswordValid } from '../utils/auxiliaryMethods';

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