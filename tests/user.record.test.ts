import { it, expect } from 'vitest';
import { NewUserEntity } from '../types';
import { UserRecord } from '../records/user.record';

const defaultObj: NewUserEntity = {
  name: 'Tester',
  email: 'test@example.com',
  family: 'Testowa',
  password: 'validpass1%',
};

it('should build UserRecord', () => {
  const user = new UserRecord(defaultObj);

  expect(typeof user.userId).toBe('string');
  expect(user.userName).toBe(defaultObj.name);
  expect(user.userEmail).toBe(defaultObj.email);
  expect(user.familyName).toBe(defaultObj.family);
});
