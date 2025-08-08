import { IGetMeService } from '../get-me/get-me-service.interface';

export interface IMockGetMeService extends IGetMeService {
  getMe: jest.Mock;
}

class MockGetMeService implements IMockGetMeService {
  getMe = jest.fn();
}

export const createMockGetMeService = (): IMockGetMeService => {
  return new MockGetMeService();
};
