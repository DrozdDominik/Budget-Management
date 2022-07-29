import { Request, Response } from 'express';
import { UserRecord } from '../records/user.record';
import { NewUserEntity, UserResponse } from '../types';
import { AppError } from '../utils/error';
import { createToken, generateToken, removeToken } from '../auth/token';

export const register = async (req: Request, res: Response) => {
  const user = new UserRecord(req.body as NewUserEntity);
  await user.insert();
  res.status(201).json({ id: user.userId });
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

  return res
    .cookie('jwt', token.accessToken, {
      secure: false,
      domain: 'localhost',
      httpOnly: true,
    })
    .json({ ok: true });
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
