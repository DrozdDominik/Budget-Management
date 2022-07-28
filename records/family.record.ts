import { v4 as uuid } from 'uuid';
import { NewFamilyEntity } from '../types/family';
import { AppError } from '../utils/error';

export class FamilyRecord {
  private readonly id: string;
  private name: string;
  private budget: number;

  constructor(obj: NewFamilyEntity) {
    this.id = obj.id ?? uuid();

    if (!obj.name || obj.name.length < 3 || obj.name.length > 50) {
      throw new AppError(
        `Family name must be between 3 and 50 characters - now is ${obj.name.length}.`,
        400,
      );
    }

    if (obj.budget && obj.budget < 0) {
      throw new AppError('Budget must not be lesser then zero.', 400);
    }

    this.name = obj.name;
    this.budget = obj.budget ?? 0;
  }

  get familyId() {
    return this.id;
  }

  get familyName() {
    return this.name;
  }

  set familyName(name: string) {
    if (!name || name.length < 3 || name.length > 50) {
      throw new AppError(
        `Family name must be between 3 and 50 characters - now is ${name.length}.`,
        400,
      );
    }
    this.name = name;
  }

  get familyBudget() {
    return this.budget;
  }

  set familyBudget(budget: number) {
    if (budget < 0) {
      throw new AppError('Budget must not be lesser then zero.', 400);
    }
    this.budget = budget;
  }
}