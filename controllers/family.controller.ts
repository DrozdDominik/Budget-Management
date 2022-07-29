import { Request, RequestHandler, Response } from 'express';
import { validate } from 'uuid';
import { FamilyRecord } from '../records/family.record';
import { AppError } from '../utils/error';

export const getAllFamilies = async (req: Request, res: Response) => {
  const families = await FamilyRecord.getAll();
  res.json(families);
};

export const increaseFamilyBudget: RequestHandler<{ id: string }> = async (
  req,
  res,
) => {
  const amount = (req.body as { amount: number }).amount;

  if (amount < 0) {
    throw new AppError('Cannot decrease family budget', 400);
  }

  const familyId = req.params.id;

  if (!validate(familyId)) {
    throw new AppError('Provided invalid family id', 400);
  }

  const family = await FamilyRecord.getOne(familyId);

  family.familyBudget = amount;

  if (!(await family.updateBudget())) {
    throw new AppError('Sorry update operation failed.', 500);
  }

  res.json(family);
};
