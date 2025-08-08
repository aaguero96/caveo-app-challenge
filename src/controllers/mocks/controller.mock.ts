import { IController } from '../controller.interface';

export interface IMockController extends IController {
  signInOrRegister: jest.Mock;
  editAccount: jest.Mock;
  getMe: jest.Mock;
  getUsers: jest.Mock;
}

class MockController implements IMockController {
  signInOrRegister = jest.fn();
  editAccount = jest.fn();
  getMe = jest.fn();
  getUsers = jest.fn();
}

export const createMockController = (): IMockController => {
  return new MockController();
};
