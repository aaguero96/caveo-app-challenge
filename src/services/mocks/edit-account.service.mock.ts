import { IEditAccountService } from '../edit-account/edit-account-service.interface';

export interface IMockEditAccountService extends IEditAccountService {
  editAccount: jest.Mock;
}

class MockEditAccountService implements IMockEditAccountService {
  editAccount = jest.fn();
}

export const createMockEditAccountService = (): IMockEditAccountService => {
  return new MockEditAccountService();
};
