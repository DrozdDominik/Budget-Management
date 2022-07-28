import { v4 as uuid } from 'uuid';
import { FamilyEntityId, NewFamilyEntity } from '../types/family';
import { AppError } from '../utils/error';
import { pool } from '../utils/db';
import { trimAndChangeFirstLetterToUppercaseAndOtherToLowercase } from '../utils/auxiliaryMethods';
import { FieldPacket } from 'mysql2';

type FamilyEntityResultId = [FamilyEntityId[], FieldPacket[]];

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

    if (obj.budget && (obj.budget < 0 || obj.budget > 9999999)) {
      throw new AppError('Budget must be between 0 and 9999999.', 400);
    }

    this.name = trimAndChangeFirstLetterToUppercaseAndOtherToLowercase(
      obj.name,
    );
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
    this.name = trimAndChangeFirstLetterToUppercaseAndOtherToLowercase(name);
  }

  get familyBudget() {
    return this.budget;
  }

  set familyBudget(budget: number) {
    if (budget < 0 || budget > 9999999) {
      throw new AppError('Budget must be between 0 and 9999999.', 400);
    }
    this.budget = budget;
  }

  public async insert(): Promise<string> {
    const id = await this.getIdOfFamilyWithGivenName(this.name);

    if (id !== null) {
      return id;
    }

    await pool.execute('INSERT INTO `families` VALUES (:id, :name, :budget);', {
      id: this.id,
      name: this.name,
      budget: this.budget,
    });
    return this.id;
  }

  public async getIdOfFamilyWithGivenName(
    name: string,
  ): Promise<string | null> {
    const [results] = (await pool.execute(
      'SELECT `id` FROM `families` WHERE `name` = :name;',
      {
        name: name,
      },
    )) as FamilyEntityResultId;

    return results.length === 0 ? null : results[0].id;
  }
}
