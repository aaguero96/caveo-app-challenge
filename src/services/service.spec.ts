/* eslint-disable @typescript-eslint/no-explicit-any */

import { IEditAccountService } from './edit-account/edit-account-service.interface';
import { IGetMeService } from './get-me/get-me-service.interface';
import { IGetUsersService } from './get-users/get-users.service.interface';
import { createService } from './service';
import { IService } from './service.interface';
import { ISignInOrRegisterService } from './sign-in-or-register/sign-in-or-register-service.interface';

describe('Service', () => {
  class MockSignInOrRegisterService implements ISignInOrRegisterService {
    signInOrRegister = jest.fn();
  }

  class MockEditAccountService implements IEditAccountService {
    editAccount = jest.fn();
  }

  class MockGetMeService implements IGetMeService {
    getMe = jest.fn();
  }

  class MockGetUsersService implements IGetUsersService {
    getUsers = jest.fn();
  }

  let mockSignInOrRegisterService: MockSignInOrRegisterService;
  let mockEditAccountService: MockEditAccountService;
  let mockGetMeService: MockGetMeService;
  let mockGetUsersService: MockGetUsersService;
  let service: IService;

  beforeEach(() => {
    mockSignInOrRegisterService = new MockSignInOrRegisterService();
    mockEditAccountService = new MockEditAccountService();
    mockGetMeService = new MockGetMeService();
    mockGetUsersService = new MockGetUsersService();
    service = createService(
      mockSignInOrRegisterService,
      mockEditAccountService,
      mockGetMeService,
      mockGetUsersService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signInOrRegister', () => {
    it('success case', async () => {
      const dto = {} as any;

      mockSignInOrRegisterService.signInOrRegister.mockResolvedValueOnce({});

      await expect(service.signInOrRegister(dto)).resolves.toStrictEqual({});
      expect(
        mockSignInOrRegisterService.signInOrRegister.mock.calls,
      ).toStrictEqual([[dto]]);
    });

    it('error case', async () => {
      const dto = {} as any;

      mockSignInOrRegisterService.signInOrRegister.mockRejectedValueOnce(
        new Error('mocked error'),
      );

      await expect(service.signInOrRegister(dto)).rejects.toThrow(
        'mocked error',
      );
      expect(
        mockSignInOrRegisterService.signInOrRegister.mock.calls,
      ).toStrictEqual([[dto]]);
    });
  });

  describe('editAccount', () => {
    it('success case', async () => {
      const dto = {} as any;

      mockEditAccountService.editAccount.mockResolvedValueOnce({});

      await expect(service.editAccount(dto)).resolves.toStrictEqual({});
      expect(mockEditAccountService.editAccount.mock.calls).toStrictEqual([
        [dto],
      ]);
    });

    it('error case', async () => {
      const dto = {} as any;

      mockEditAccountService.editAccount.mockRejectedValueOnce(
        new Error('mocked error'),
      );

      await expect(service.editAccount(dto)).rejects.toThrow('mocked error');
      expect(mockEditAccountService.editAccount.mock.calls).toStrictEqual([
        [dto],
      ]);
    });
  });

  describe('getMe', () => {
    it('success case', async () => {
      const dto = {} as any;

      mockGetMeService.getMe.mockResolvedValueOnce({});

      await expect(service.getMe(dto)).resolves.toStrictEqual({});
      expect(mockGetMeService.getMe.mock.calls).toStrictEqual([[dto]]);
    });

    it('error case', async () => {
      const dto = {} as any;

      mockGetMeService.getMe.mockRejectedValueOnce(new Error('mocked error'));

      await expect(service.getMe(dto)).rejects.toThrow('mocked error');
      expect(mockGetMeService.getMe.mock.calls).toStrictEqual([[dto]]);
    });
  });

  describe('getUsers', () => {
    it('success case', async () => {
      const dto = {} as any;

      mockGetUsersService.getUsers.mockResolvedValueOnce({});

      await expect(service.getUsers(dto)).resolves.toStrictEqual({});
      expect(mockGetUsersService.getUsers.mock.calls).toStrictEqual([[dto]]);
    });

    it('error case', async () => {
      const dto = {} as any;

      mockGetUsersService.getUsers.mockRejectedValueOnce(
        new Error('mocked error'),
      );

      await expect(service.getUsers(dto)).rejects.toThrow('mocked error');
      expect(mockGetUsersService.getUsers.mock.calls).toStrictEqual([[dto]]);
    });
  });
});
