import { Router } from 'express';
import { auth, restrictTo } from '../auth/auth';
import {
  getAllFamilies,
  increaseFamilyBudget,
} from '../controllers/family.controller';
import { UserRole } from '../types';
import { methodNotAllowed } from '../utils/error';

export const familyRouter = Router();

familyRouter
  .route('/')
  .get(auth, restrictTo(UserRole.Admin), getAllFamilies)
  .all(methodNotAllowed);

familyRouter
  .route('/:id')
  .patch(auth, restrictTo(UserRole.Admin), increaseFamilyBudget)
  .all(methodNotAllowed);
