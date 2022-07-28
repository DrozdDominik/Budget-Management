import { it, expect, describe } from 'vitest';
import { NewFamilyEntity } from '../types/family';
import { FamilyRecord } from '../records/family.record';

const defaultObj: NewFamilyEntity = {
  name: 'Testowa',
};

describe('FamilyRecord constructor', () => {
  it('should build FamilyRecord', () => {
    const family = new FamilyRecord(defaultObj);

    expect(typeof family.familyId).toBe('string');
    expect(family.familyName).toBe(defaultObj.name);
    expect(family.familyBudget).toBe(0);
  });

  it('should throw AppError when provided budget lesser than zero', () => {
    const invalidObj: NewFamilyEntity = {
      ...defaultObj,
      budget: -4,
    };

    expect(() => new FamilyRecord(invalidObj)).toThrowError(
      /^Budget must be between 0 and 9999999.$/,
    );
  });

  it('should throw AppError when provided budget greater than 9999999', () => {
    const invalidObj: NewFamilyEntity = {
      ...defaultObj,
      budget: 10000000,
    };

    expect(() => new FamilyRecord(invalidObj)).toThrowError(
        /^Budget must be between 0 and 9999999.$/,
    );
  });

  it('should throw AppError when provided invalid name', () => {
    const invalidObj: NewFamilyEntity = {
      name: 'T',
    };

    expect(() => new FamilyRecord(invalidObj)).toThrowError(
      /^Family name must be between 3 and 50 characters - now is 1.$/,
    );
  });
});
