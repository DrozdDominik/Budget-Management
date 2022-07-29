import { v4 as uuid } from 'uuid';
import { NewFamilyEntity } from '../types/family';
import { AppError } from '../utils/error';
import { pool } from '../utils/db';
import { trimAndChangeFirstLetterToUppercaseAndOtherToLowercase } from '../utils/auxiliaryMethods';
import { FieldPacket, ResultSetHeader } from 'mysql2';

type FamilyEntityResults = [NewFamilyEntity[], FieldPacket[]];

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
    const newBudget = this.budget + budget;

    if (newBudget < 0) {
      throw new AppError('Not enough money in the budget.', 400);
    }

    if (newBudget > 9999999) {
      throw new AppError('The budget cannot be greater than 9999999', 400);
    }

    this.budget = newBudget;
  }

  public async insert(): Promise<void> {
    await pool.execute('INSERT INTO `families` VALUES (:id, :name, :budget);', {
      id: this.id,
      name: this.name,
      budget: this.budget,
    });
  }

  public static async getFamilyByName(
    name: string,
  ): Promise<FamilyRecord | null> {
    const [results] = (await pool.execute(
      'SElECT * FROM `families` WHERE `name` = :name;',
      { name },
    )) as FamilyEntityResults;

    return results.length === 0 ? null : new FamilyRecord(results[0]);
  }

  public static async getAll(): Promise<FamilyRecord[]> {
    const [results] = (await pool.execute(
      'SELECT * FROM `families` WHERE `name` != :admin;',
      {
        admin: 'Admin',
      },
    )) as FamilyEntityResults;

    return results.map(result => new FamilyRecord(result));
  }

  public static async getOne(id: string): Promise<FamilyRecord | null> {
    const [results] = (await pool.execute(
      'SElECT * FROM `families` WHERE `id` = :id;',
      { id },
    )) as FamilyEntityResults;

    return results.length === 0 ? null : new FamilyRecord(results[0]);
  }

  public async updateBudget(): Promise<boolean> {
    const [results] = (await pool.execute(
      'UPDATE `families` SET `budget` = :budget WHERE `id` = :id;',
      {
        id: this.id,
        budget: this.budget,
      },
    )) as [ResultSetHeader, FieldPacket[]];

    return results.affectedRows === 1;
  }
}
