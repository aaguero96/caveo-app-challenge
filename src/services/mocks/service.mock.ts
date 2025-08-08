import { IService } from '../service.interface';

export interface IMockService extends IService {
  signInOrRegister: jest.Mock;
  editAccount: jest.Mock;
  getMe: jest.Mock;
  getUsers: jest.Mock;
}

class MockService implements IMockService {
  signInOrRegister = jest.fn();
  editAccount = jest.fn();
  getMe = jest.fn();
  getUsers = jest.fn();
}

export const createMockService = (): IMockService => {
  return new MockService();
};
