import { v4 as uuid } from 'uuid';
import { NewExpenseEntity } from '../types';
import { AppError } from '../utils/error';
import { pool } from '../utils/db';

export class ExpenseRecord {
  private readonly id: string;
  private name: string;
  private amount: number;
  private userId: string;

  constructor(obj: NewExpenseEntity) {
    this.id = obj.id ?? uuid();

    if (!obj.name || obj.name.length < 2 || obj.name.length > 50) {
      throw new AppError(
        `Expense name must be between 2 and 50 characters - now is ${obj.name.length}.`,
        400,
      );
    }

    if (!obj.amount || obj.amount <= 0 || obj.amount > 9999999) {
      throw new AppError(
        `Expense amount cannot be equal or lesser than zero or greater than 9999999.`,
        400,
      );
    }

    if (!obj.userId) {
      throw new AppError(`User id must be provided.`, 400);
    }

    this.name = obj.name;
    this.amount = obj.amount;
    this.userId = obj.userId;
  }

  get expenseId() {
    return this.id;
  }

  get expenseName() {
    return this.name;
  }

  get expenseAmount() {
    return this.amount;
  }

  get expenseUserId() {
    return this.userId;
  }

  public async insert() {
    await pool.execute(
      'INSERT INTO `expenses` VALUES (:id, :name, :amount, :user_id);',
      {
        id: this.id,
        name: this.name,
        amount: this.amount,
        user_id: this.userId,
      },
    );
  }
}
