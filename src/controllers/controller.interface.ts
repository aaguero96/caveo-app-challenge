import Application from 'koa';

export interface IController {
  signInOrRegister(ctx: Application.ParameterizedContext): Promise<void>;
  editAccount(ctx: Application.ParameterizedContext): Promise<void>;
  getMe(ctx: Application.ParameterizedContext): Promise<void>;
  getUsers(ctx: Application.ParameterizedContext): Promise<void>;
}
