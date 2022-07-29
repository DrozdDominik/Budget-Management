import { Router } from 'express';
import { methodNotAllowed } from '../utils/error';
import { auth } from '../auth/auth';
import {addExpense} from "../controllers/expense.controller";

export const expenseRouter = Router();

expenseRouter.route('/').post(auth, addExpense).all(methodNotAllowed);