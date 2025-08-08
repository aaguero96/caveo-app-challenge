/* eslint-disable @typescript-eslint/no-explicit-any */

import { DataSource, EntityManager, QueryRunner } from 'typeorm';
import { IEditAccountService } from './edit-account-service.interface';
import { createEditAccountService } from './edit-account.service';
import {
  createMockUserRepository,
  IMockUserRepository,
} from '../../repositories/mocks';
import { createMockAuth, IMockAuth } from '../../auth/mocks';
import { UserRoleEnum } from '../../enums';

describe('EditAccountService', () => {
  let mockManager: EntityManager;
  let mockQueryRunner: QueryRunner;
  let mockDataSource: DataSource;
  let mockUserRepository: IMockUserRepository;
  let mockAuth: IMockAuth;
  let editAccountService: IEditAccountService;

  beforeEach(() => {
    mockManager = {} as any;
    mockQueryRunner = {
      manager: mockManager,
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
    } as any;
    mockDataSource = {
      createQueryRunner: jest.fn().mockImplementation(() => mockQueryRunner),
    } as any;
    mockUserRepository = createMockUserRepository();
    mockAuth = createMockAuth();
    editAccountService = createEditAccountService(
      mockDataSource,
      mockUserRepository,
      mockAuth,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('editAccount', () => {
    it('error when user is not found', async () => {
      const dto = {
        userId: '1',
      };
      const ctxUser = {
        id: '1',
        role: UserRoleEnum.ADMIN,
      } as any;

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        editAccountService.editAccount(ctxUser, dto),
      ).rejects.toThrow('entity User not found');

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: '1' });
    });

    it('error when role is not allowed', async () => {
      const dto = {
        userId: '1',
      };
      const ctxUser = {
        id: '1',
        role: UserRoleEnum.ADMIN,
      } as any;

      mockUserRepository.findOne.mockResolvedValue({
        id: '1',
        role: 'mock',
      });

      await expect(
        editAccountService.editAccount(ctxUser, dto),
      ).rejects.toThrow('role "mock" is not allowed');

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: '1' });
    });

    describe('admin role', () => {
      it('sholdnt update your role', async () => {
        const dto = {
          userId: '1',
          role: UserRoleEnum.ADMIN,
        };
        const ctxUser = {
          id: '1',
          role: UserRoleEnum.ADMIN,
        } as any;

        mockUserRepository.findOne.mockResolvedValue({
          id: '1',
          role: 'admin',
        });

        await expect(
          editAccountService.editAccount(ctxUser, dto),
        ).rejects.toThrow('role "admin" sholdnt update your role');

        expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: '1' });
      });

      it('success updating role', async () => {
        const dto = {
          userId: '2',
          role: UserRoleEnum.ADMIN,
        };
        const ctxUser = {
          id: '1',
          role: UserRoleEnum.ADMIN,
        } as any;

        mockUserRepository.findOne.mockResolvedValueOnce({
          id: '2',
          role: 'admin',
          email: 'mock@test.com',
        });
        mockUserRepository.update.mockResolvedValueOnce(undefined);
        mockAuth.addRoleToUser.mockResolvedValue(undefined);

        const response = await editAccountService.editAccount(ctxUser, dto);

        expect(mockUserRepository.findOne).toHaveBeenCalledWith({
          id: '2',
        });
        expect(mockUserRepository.update).toHaveBeenCalledWith(
          '2',
          { id: '2', role: 'admin', email: 'mock@test.com' },
          { manager: mockManager },
        );
        expect(mockAuth.addRoleToUser).toHaveBeenCalledWith(
          'mock@test.com',
          'admin',
        );
        expect(response).toStrictEqual({
          userId: '2',
          name: undefined,
          role: 'admin',
          createdAt: undefined,
          updatedAt: undefined,
        });
      });

      it('success updating name', async () => {
        const dto = {
          userId: '2',
          name: 'ANDRE AGUERO',
        };
        const ctxUser = {
          id: '1',
          role: UserRoleEnum.ADMIN,
        } as any;

        mockUserRepository.findOne.mockResolvedValueOnce({
          id: '2',
          role: 'admin',
          email: 'mock@test.com',
        });
        mockUserRepository.update.mockResolvedValueOnce(undefined);
        mockAuth.addRoleToUser.mockResolvedValue(undefined);

        const response = await editAccountService.editAccount(ctxUser, dto);

        expect(mockUserRepository.findOne).toHaveBeenCalledWith({
          id: '2',
        });
        expect(mockUserRepository.update).toHaveBeenCalledWith(
          '2',
          {
            id: '2',
            role: 'admin',
            name: 'ANDRE AGUERO',
            email: 'mock@test.com',
            isOnboarded: true,
          },
          { manager: mockManager },
        );
        expect(response).toStrictEqual({
          userId: '2',
          name: 'ANDRE AGUERO',
          role: 'admin',
          createdAt: undefined,
          updatedAt: undefined,
        });
      });
    });

    describe('user role', () => {
      it('sholdnt update role', async () => {
        const dto = {
          userId: '1',
          role: UserRoleEnum.USER,
        };
        const ctxUser = {
          id: '1',
          role: UserRoleEnum.USER,
        } as any;

        mockUserRepository.findOne.mockResolvedValue({
          id: '1',
          role: 'usuário',
        });

        await expect(
          editAccountService.editAccount(ctxUser, dto),
        ).rejects.toThrow('role "usuário" sholdnt update role');

        expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: '1' });
      });

      it('sholdnt update others', async () => {
        const dto = {
          userId: '2',
          role: UserRoleEnum.USER,
        };
        const ctxUser = {
          id: '1',
          role: UserRoleEnum.USER,
        } as any;

        mockUserRepository.findOne.mockResolvedValue({
          id: '1',
          role: 'usuário',
        });

        await expect(
          editAccountService.editAccount(ctxUser, dto),
        ).rejects.toThrow('role "usuário" sholdnt update others');

        expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: '2' });
      });

      it('success updating name', async () => {
        const dto = {
          userId: '1',
          name: 'ANDRE AGUERO',
        };
        const ctxUser = {
          id: '1',
          role: UserRoleEnum.USER,
        } as any;

        mockUserRepository.findOne.mockResolvedValueOnce({
          id: '1',
          role: 'admin',
          email: 'mock@test.com',
        });
        mockUserRepository.update.mockResolvedValueOnce(undefined);
        mockAuth.addRoleToUser.mockResolvedValue(undefined);

        const response = await editAccountService.editAccount(ctxUser, dto);

        expect(mockUserRepository.findOne).toHaveBeenCalledWith({
          id: '1',
        });
        expect(mockUserRepository.update).toHaveBeenCalledWith(
          '1',
          {
            id: '1',
            role: 'admin',
            name: 'ANDRE AGUERO',
            email: 'mock@test.com',
            isOnboarded: true,
          },
          { manager: mockManager },
        );
        expect(response).toStrictEqual({
          userId: '1',
          name: 'ANDRE AGUERO',
          role: 'admin',
          createdAt: undefined,
          updatedAt: undefined,
        });
      });

      it('success updating nothing', async () => {
        const dto = {
          userId: '1',
        };
        const ctxUser = {
          id: '1',
          role: UserRoleEnum.USER,
        } as any;

        mockUserRepository.findOne.mockResolvedValueOnce({
          id: '1',
          role: 'admin',
          email: 'mock@test.com',
        });
        mockUserRepository.update.mockResolvedValueOnce(undefined);
        mockAuth.addRoleToUser.mockResolvedValue(undefined);

        const response = await editAccountService.editAccount(ctxUser, dto);

        expect(mockUserRepository.findOne).toHaveBeenCalledWith({
          id: '1',
        });
        expect(mockUserRepository.update).toHaveBeenCalledWith(
          '1',
          {
            id: '1',
            role: 'admin',
            email: 'mock@test.com',
          },
          { manager: mockManager },
        );
        expect(response).toStrictEqual({
          userId: '1',
          name: undefined,
          role: 'admin',
          createdAt: undefined,
          updatedAt: undefined,
        });
      });
    });
  });
});
