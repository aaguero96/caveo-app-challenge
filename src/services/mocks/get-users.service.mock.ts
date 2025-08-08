import { IGetUsersService } from '../get-users/get-users.service.interface';

export interface IMockGetUsersService extends IGetUsersService {
  getUsers: jest.Mock;
}

class MockGetUsersService implements IMockGetUsersService {
  getUsers = jest.fn();
}

export const createMockGetUsersService = (): IMockGetUsersService => {
  return new MockGetUsersService();
};
