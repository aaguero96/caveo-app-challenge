/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  IMockSignInOrRegisterService,
  createMockSignInOrRegisterService,
  IMockEditAccountService,
  createMockEditAccountService,
  IMockGetMeService,
  createMockGetMeService,
  IMockGetUsersService,
  createMockGetUsersService,
} from './mocks';
import { createService } from './service';
import { IService } from './service.interface';

describe('Service', () => {
  let mockSignInOrRegisterService: IMockSignInOrRegisterService;
  let mockEditAccountService: IMockEditAccountService;
  let mockGetMeService: IMockGetMeService;
  let mockGetUsersService: IMockGetUsersService;
  let service: IService;

  beforeEach(() => {
    mockSignInOrRegisterService = createMockSignInOrRegisterService();
    mockEditAccountService = createMockEditAccountService();
    mockGetMeService = createMockGetMeService();
    mockGetUsersService = createMockGetUsersService();
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
      const ctxUser = { id: '1' } as any;

      mockEditAccountService.editAccount.mockResolvedValueOnce({});

      await expect(service.editAccount(ctxUser, dto)).resolves.toStrictEqual(
        {},
      );
      expect(mockEditAccountService.editAccount.mock.calls).toStrictEqual([
        [ctxUser, dto],
      ]);
    });

    it('error case', async () => {
      const dto = { id: '1' } as any;
      const ctxUser = {} as any;

      mockEditAccountService.editAccount.mockRejectedValueOnce(
        new Error('mocked error'),
      );

      await expect(service.editAccount(ctxUser, dto)).rejects.toThrow(
        'mocked error',
      );
      expect(mockEditAccountService.editAccount.mock.calls).toStrictEqual([
        [ctxUser, dto],
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
