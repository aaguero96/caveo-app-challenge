import { IUserRepository } from '../user/user-repository.interface';

export interface IMockUserRepository extends IUserRepository {
  create: jest.Mock;
  findOne: jest.Mock;
  find: jest.Mock;
  update: jest.Mock;
  findAndCount: jest.Mock;
}

class MockUserRepository implements IMockUserRepository {
  create = jest.fn();
  findOne = jest.fn();
  find = jest.fn();
  update = jest.fn();
  findAndCount = jest.fn();
}

export const createMockUserRepository = (): IMockUserRepository => {
  return new MockUserRepository();
};
