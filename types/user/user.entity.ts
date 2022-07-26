import { UserRole } from './user.role';

export interface NewUserEntity {
  id?: string;
  name: string;
  email: string;
  family: string;
  password?: string;
  currentTokenId?: string | null;
  role?: UserRole;
}