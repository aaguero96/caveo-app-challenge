import { ParameterizedContext } from 'koa';
import { IController } from './controller.interface';

export const createController = (): IController => {
  return new Controller();
};

class Controller implements IController {
  constructor() {}

  signInOrRegister = async (ctx: ParameterizedContext): Promise<void> => {
    throw new Error('Method not implemented.');
  };

  editAccount = async (ctx: ParameterizedContext): Promise<void> => {
    throw new Error('Method not implemented.');
  };

  getMe = async (ctx: ParameterizedContext): Promise<void> => {
    throw new Error('Method not implemented.');
  };

  getUsers = async (ctx: ParameterizedContext): Promise<void> => {
    throw new Error('Method not implemented.');
  };
}
