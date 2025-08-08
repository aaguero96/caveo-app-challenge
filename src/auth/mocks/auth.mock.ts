import { IAuth } from '../auth.interface';

export interface IMockAuth extends IAuth {
  signIn: jest.Mock;
  signUp: jest.Mock;
  decodeToken: jest.Mock;
  confirmUser: jest.Mock;
  addRoleToUser: jest.Mock;
}

class MockAuth implements IMockAuth {
  signIn = jest.fn();
  signUp = jest.fn();
  decodeToken = jest.fn();
  confirmUser = jest.fn();
  addRoleToUser = jest.fn();
}

export const createMockAuth = (): IMockAuth => {
  return new MockAuth();
};
