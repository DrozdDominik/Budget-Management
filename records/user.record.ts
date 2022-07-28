import { v4 as uuid } from 'uuid';
import { FieldPacket, ResultSetHeader } from 'mysql2';
import { NewUserEntity, UserRole } from '../types';
import { AppError } from '../utils/error';
import { pool } from '../utils/db';
import {
  hashPassword,
  isEmailValid,
  isPasswordValid,
} from '../utils/auxiliaryMethods';

type UserRecordResults = [NewUserEntity[], FieldPacket[]];

export class UserRecord {
  private readonly id: string;
  private name: string;
  private email: string;
  private family: string;
  private passwordHash?: string;
  private currentTokenId: string | null;
  private readonly role: UserRole;

  constructor(obj: NewUserEntity) {
    this.id = obj.id ?? uuid();
    this.currentTokenId = obj.currentTokenId ?? null;

    if (!obj.name || obj.name.length < 2 || obj.name.length > 30) {
      throw new AppError(
        `User name must be between 2 and 30 characters - now is ${obj.name.length}.`,
        400,
      );
    }

    if (!isEmailValid(obj.email)) {
      throw new AppError('Provided email is not valid.', 400);
    }

    if (!obj.family) {
      throw new AppError('Family must be provided', 400);
    }

    if (obj.password && !isPasswordValid(obj.password)) {
      throw new AppError(
        `Provided password is not valid. Password should be between 7 to 15 characters which contain at least one numeric digit and a special character.`,
        400,
      );
    }

    this.name = obj.name;
    this.email = obj.email;
    this.family = obj.family;
    if (obj.password) {
      this.passwordHash = hashPassword(obj.password);
    }
  }

  get userId() {
    return this.id;
  }

  get userName() {
    return this.name;
  }

  get userEmail() {
    return this.email;
  }

  get familyName() {
    return this.family;
  }

  get userCurrentTokenId() {
    return this.currentTokenId;
  }

  set userCurrentTokenId(tokenId: string | null) {
    this.currentTokenId = tokenId;
  }

  get userRole() {
    return this.role;
  }

  public async insert(): Promise<string> {
    if (await this.isEmailTaken(this.email)) {
      throw new AppError(`Email ${this.email} is already taken!`, 400);
    }

    await pool.execute(
      'INSERT INTO `users` VALUES (:id, :name, :email, :family, :password_hash, :current_token_id, :role);',
      {
        id: this.id,
        name: this.name,
        email: this.email,
        family: this.family,
        password_hash: this.passwordHash,
        current_token_id: this.userCurrentTokenId,
        role: this.role,
      },
    );
    return this.id;
  }

  public async isEmailTaken(email: string): Promise<boolean> {
    const [results] = (await pool.execute(
      'SELECT * FROM `users` WHERE `email` = :email;',
      {
        email: email,
      },
    )) as UserRecordResults;

    return results.length === 1;
  }

  public static async findOneByToken(
    token: string,
  ): Promise<UserRecord> | null {
    const [results] = (await pool.execute(
      'SELECT * FROM `users` WHERE `current_token_id` = :token;',
      {
        token,
      },
    )) as UserRecordResults;

    return results.length === 0 ? null : new UserRecord(results[0]);
  }

  public async updateUserTokenId(): Promise<boolean> {
    const [results] = (await pool.execute(
      'UPDATE `users` SET `current_token_id` = :token WHERE `id` = :id;',
      {
        token: this.userCurrentTokenId,
        id: this.id,
      },
    )) as [ResultSetHeader, FieldPacket[]];

    return results.affectedRows === 1;
  }

  public static async findOneByCredentials(
    email: string,
    password: string,
  ): Promise<UserRecord> | null {
    const [results] = (await pool.execute(
      'SELECT `id`, `name`, `email`, `current_token_id`, `role` FROM `users` WHERE `email` = :email AND `password_hash` = :passwordHash;',
      {
        email,
        passwordHash: hashPassword(password),
      },
    )) as UserRecordResults;

    return results.length === 0 ? null : new UserRecord(results[0]);
  }
}
