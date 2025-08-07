import { UserRoleEnum } from '../enums';

export interface IAuth {
  signIn(
    email: string,
    password: string,
  ): Promise<{ token: string; expiresIn: string }>;
  signUp(email: string, password: string): Promise<void>;
  decodeToken(token: string): Promise<{ email: string; roles: UserRoleEnum[] }>;
  confirmUser(email: string): Promise<void>;
  addRoleToUser(email: string, role: UserRoleEnum): Promise<void>;
}
