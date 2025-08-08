import { ISignInOrRegisterService } from '../sign-in-or-register/sign-in-or-register-service.interface';

export interface IMockSignInOrRegisterService extends ISignInOrRegisterService {
  signInOrRegister: jest.Mock;
}

class MockSignInOrRegisterService implements IMockSignInOrRegisterService {
  signInOrRegister = jest.fn();
}

export const createMockSignInOrRegisterService =
  (): IMockSignInOrRegisterService => {
    return new MockSignInOrRegisterService();
  };
