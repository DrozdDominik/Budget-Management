import { Request, Response } from 'express';
import { UserRecord } from '../records/user.record';
import {
  NewUserEntity,
  UserLoginResponse,
  UserRegisterResponse,
  UserResponse,
} from '../types';
import { AppError } from '../utils/error';
import { createToken, generateToken, removeToken } from '../auth/token';

export const register = async (req: Request, res: Response) => {
  const user = new UserRecord(req.body as NewUserEntity);
  await user.insert();

  const response: UserRegisterResponse = { id: user.userId };

  res.status(201).json(response);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };

  const user: UserRecord | null = await UserRecord.findOneByCredentials(
    email,
    password,
  );

  if (!user) {
    throw new AppError('Invalid credentials.', 401);
  }
  const token = createToken(await generateToken(user));

  const response: UserLoginResponse = { ok: true };

  return res
    .cookie('jwt', token.accessToken, {
      secure: false,
      domain: 'localhost',
      httpOnly: true,
    })
    .json(response);
};

export const logout = async (req: Request, res: Response) => {
  const user = req.user as UserRecord;

  await removeToken(user, res);
};

export const getUserData = async (req: Request, res: Response) => {
  const user = req.user as UserRecord;

  const family = await user.findUserFamily();

  const data: UserResponse = {
    id: user.userId,
    name: user.userName,
    familyId: family.familyId,
    familyName: family.familyName,
    budget: family.familyBudget,
  };

  res.json(data);
};
