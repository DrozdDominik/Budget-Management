import { it, expect, describe } from 'vitest';
import { NewUserEntity } from '../types';
import { UserRecord } from '../records/user.record';

const defaultObj: NewUserEntity = {
  name: 'Tester',
  email: 'test@example.com',
  family: 'Testowa',
  password: 'validpass1%',
};
describe('UserRecord constructor', () => {
  it('should build UserRecord', () => {
    const user = new UserRecord(defaultObj);

    expect(typeof user.userId).toBe('string');
    expect(user.userName).toBe(defaultObj.name);
    expect(user.userEmail).toBe(defaultObj.email);
    expect(user.familyName).toBe(defaultObj.family);
  });

  it('should throw AppError when provided invalid name', () => {
    const invalidObj: NewUserEntity = {
      ...defaultObj,
      name: 'T',
    };

    expect(() => new UserRecord(invalidObj)).toThrowError(
      /^User name must be between 2 and 30 characters - now is 1.$/,
    );
  });
});