import { Router } from 'express';
import { methodNotAllowed } from '../utils/error';
import { auth } from '../auth/auth';
import {
  register,
  login,
  logout,
  getUserData,
} from '../controllers/user.controller';

export const userRouter = Router();

userRouter.route('/').get(auth, getUserData).post(register).all(methodNotAllowed);

userRouter.route('/login').post(login).all(methodNotAllowed);

userRouter.route('/logout').get(auth, logout).all(methodNotAllowed);
