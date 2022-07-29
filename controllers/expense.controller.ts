import { Request, Response } from 'express';
import { UserRecord } from '../records/user.record';
import { FamilyRecord } from '../records/family.record';
import { ExpenseRecord } from '../records/expense.record';
import { AddExpenseResponse, ExpenseEntity } from '../types';
import { AppError } from '../utils/error';

export const addExpense = async (req: Request, res: Response) => {
  const user = req.user as UserRecord;

  const { name, amount } = req.body as { name: string; amount: number };

  const family = await FamilyRecord.getFamilyByName(user.familyName);

  family.familyBudget = -amount;

  const expenseData: ExpenseEntity = {
    name,
    amount,
    userId: user.userId,
  };

  const expense = new ExpenseRecord(expenseData);

  await expense.insert();

  if (!(await family.updateBudget())) {
    throw new AppError('Sorry update family budget operation failed.', 500);
  }

  const data: AddExpenseResponse = {
    expenseId: expense.expenseId,
    familyBudget: family.familyBudget,
  };

  res.status(201).json(data);
};
