import { it, expect, afterAll, describe } from 'vitest';
import { NewUserEntity } from '../types';
import { pool } from '../utils/db';
import { UserRecord } from '../records/user.record';

const defaultObj: NewUserEntity = {
  name: 'Tester',
  family: 'Testowa',
  password: 'validpass1%',
};

afterAll(async () => {
  await pool.execute("DELETE FROM `users` WHERE `name` LIKE 'Test%';");
  await pool.end();
});

describe('UserRecord.insert()', () => {
  it('should returns new UUID.', async () => {
    const user = new UserRecord(defaultObj);
    const id = await user.insert();

    expect(id).toBeDefined();
    expect(typeof id).toBe('string');
  });
});
