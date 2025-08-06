import { UserRoleEnum } from '../enums';

export interface IAuth {
  signIn(
    email: string,
    password: string,
  ): Promise<{ token: string; expiresIn: string }>;
  signUp(
    email: string,
    password: string,
  ): Promise<{ token: string; expiresIn: string }>;
  validate(token: string): Promise<{ email: string; roles: UserRoleEnum[] }>;
}
