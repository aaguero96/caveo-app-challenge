import { UserRoleEnum } from '../enums';
import { IAuth } from './auth.interface';

export const createAuth = (): IAuth => {
  return new Auth();
};

class Auth implements IAuth {
  constructor() {}

  signIn = async (
    email: string,
    password: string,
  ): Promise<{ token: string; expiresIn: string }> => {
    throw new Error('Method not implemented.');
  };

  signUp = async (
    email: string,
    password: string,
  ): Promise<{ token: string; expiresIn: string }> => {
    throw new Error('Method not implemented.');
  };

  validate = async (
    token: string,
  ): Promise<{ email: string; roles: UserRoleEnum[] }> => {
    throw new Error('Method not implemented.');
  };
}
