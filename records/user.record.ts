import { v4 as uuid } from 'uuid';
import { NewUserEntity } from '../types';
import { AppError } from '../utils/error';

export class UserRecord {
  private readonly id: string;
  private name: string;
  private family: string;

  constructor(obj: NewUserEntity) {
    this.id = obj.id ?? uuid();

    if (!obj.name || obj.name.length < 2 || obj.name.length > 30) {
      throw new AppError(
        `User name must be between 2 and 30 characters - now is ${obj.name.length}.`,
        400,
      );
    }

    if (!obj.family) {
      throw new AppError('Family must be provided', 400);
    }

    this.name = obj.name;
    this.family = obj.family;
  }

  get userId() {
    return this.id;
  }

  get userName() {
    return this.name;
  }

  get familyName() {
    return this.family;
  }
}