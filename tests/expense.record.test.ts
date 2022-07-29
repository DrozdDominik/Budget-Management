import { it, expect, describe } from 'vitest';
import { faker } from '@faker-js/faker';
import { ExpenseEntity } from '../types';
import { ExpenseRecord } from '../records/expense.record';

const defaultObj: ExpenseEntity = {
  name: 'Test',
  amount: 1000,
  userId: faker.datatype.uuid(),
};

describe('ExpenseRecord constructor', () => {
  it('should build ExpenseRecord', () => {
    const expense = new ExpenseRecord(defaultObj);

    expect(typeof expense.expenseId).toBe('string');
    expect(expense.expenseName).toBe(defaultObj.name);
    expect(expense.expenseAmount).toBe(defaultObj.amount);
    expect(expense.expenseUserId).toBe(defaultObj.userId);
  });

  it('should throw AppError when provided amount equals zero', () => {
    const invalidObj: ExpenseEntity = {
      ...defaultObj,
      amount: 0,
    };

    expect(() => new ExpenseRecord(invalidObj)).toThrowError(
      /^Expense amount cannot be equal or lesser than zero or greater than 9999999.$/,
    );
  });

  it('should throw AppError when provided amount greater than 9999999', () => {
    const invalidObj: ExpenseEntity = {
      ...defaultObj,
      amount: 10000000,
    };

    expect(() => new ExpenseRecord(invalidObj)).toThrowError(
      /^Expense amount cannot be equal or lesser than zero or greater than 9999999.$/,
    );
  });
});
