/* eslint-disable @typescript-eslint/no-explicit-any */

import { DataSource, EntityManager, QueryRunner } from 'typeorm';
import { ISignInOrRegisterService } from './sign-in-or-register-service.interface';
import { createSignInOrRegosterService } from './sign-in-or-register.service';
import { IUserRepository } from '../../repositories/user/user-repository.interface';
import { IAuth } from '../../auth/auth.interface';
import { UserRoleEnum } from '../../enums';

describe('GetMeService', () => {
  class MockUserRepository implements IUserRepository {
    create = jest.fn();
    findOne = jest.fn();
    find = jest.fn();
    update = jest.fn();
  }

  class MockAuth implements IAuth {
    signIn = jest.fn();
    signUp = jest.fn();
    decodeToken = jest.fn();
    confirmUser = jest.fn();
    addRoleToUser = jest.fn();
  }

  let mockManager: EntityManager;
  let mockQueryRunner: QueryRunner;
  let mockDataSource: DataSource;
  let mockUserRepository: IUserRepository;
  let mockAuth: IAuth;
  let signInOrRegisterService: ISignInOrRegisterService;

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
    mockUserRepository = new MockUserRepository();
    mockAuth = new MockAuth();
    signInOrRegisterService = createSignInOrRegosterService(
      mockDataSource,
      mockAuth,
      mockUserRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signInOrRegister', () => {
    it('signup user when is not registered', async () => {
      const email = 'test@test.com';
      const password = 'password';

      const mockUserRepositoryFindOne = mockUserRepository.findOne as jest.Mock;
      const mockUserRepositoryCreate = mockUserRepository.create as jest.Mock;
      const mockAuthSignUp = mockAuth.signUp as jest.Mock;
      const mockAuthConfirmUser = mockAuth.confirmUser as jest.Mock;
      const mockAuthAddRoleToUser = mockAuth.addRoleToUser as jest.Mock;
      const mockAuthSignIn = mockAuth.signIn as jest.Mock;

      mockUserRepositoryFindOne.mockResolvedValueOnce(null);
      mockUserRepositoryCreate.mockResolvedValueOnce({ id: '1' });
      mockAuthSignUp.mockResolvedValueOnce(undefined);
      mockAuthConfirmUser.mockResolvedValueOnce(undefined);
      mockAuthAddRoleToUser.mockResolvedValueOnce(undefined);
      mockAuthSignIn.mockResolvedValueOnce({
        token: 'mock-token',
        expiresIn: '1s',
      });

      const response = await signInOrRegisterService.signInOrRegister({
        email,
        password,
      });

      expect(mockQueryRunner.startTransaction).toHaveBeenCalledTimes(1);
      expect(mockUserRepositoryFindOne).toHaveBeenCalledWith({ email });
      expect(mockUserRepositoryCreate).toHaveBeenCalledWith(
        { email, role: UserRoleEnum.USER },
        { manager: mockManager },
      );
      expect(mockAuthSignUp).toHaveBeenCalledWith(email, password);
      expect(mockAuthConfirmUser).toHaveBeenCalledWith(email);
      expect(mockAuthAddRoleToUser).toHaveBeenCalledWith(
        email,
        UserRoleEnum.USER,
      );
      expect(mockAuthSignIn).toHaveBeenCalledWith(email, password);
      expect(response).toStrictEqual({
        type: 'Bearer',
        token: 'mock-token',
        expiresIn: '1s',
      });
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.release).toHaveBeenCalledTimes(1);
    });

    it('signin user when is registered', async () => {
      const email = 'test@test.com';
      const password = 'password';

      const mockUserRepositoryFindOne = mockUserRepository.findOne as jest.Mock;
      const mockAuthSignIn = mockAuth.signIn as jest.Mock;

      mockUserRepositoryFindOne.mockResolvedValueOnce({ id: '1' });
      mockAuthSignIn.mockResolvedValueOnce({
        token: 'mock-token',
        expiresIn: '1s',
      });

      const response = await signInOrRegisterService.signInOrRegister({
        email,
        password,
      });

      expect(mockQueryRunner.startTransaction).toHaveBeenCalledTimes(1);
      expect(mockUserRepositoryFindOne).toHaveBeenCalledWith({ email });
      expect(mockAuthSignIn).toHaveBeenCalledWith(email, password);
      expect(response).toStrictEqual({
        type: 'Bearer',
        token: 'mock-token',
        expiresIn: '1s',
      });
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.release).toHaveBeenCalledTimes(1);
    });

    it('throw error and dont save user when have error in signup', async () => {
      const email = 'test@test.com';
      const password = 'password';

      const mockUserRepositoryFindOne = mockUserRepository.findOne as jest.Mock;
      const mockUserRepositoryCreate = mockUserRepository.create as jest.Mock;
      const mockAuthSignUp = mockAuth.signUp as jest.Mock;

      mockUserRepositoryFindOne.mockResolvedValueOnce(null);
      mockUserRepositoryCreate.mockResolvedValueOnce({ id: '1' });
      mockAuthSignUp.mockRejectedValueOnce(new Error('mock-error'));

      await expect(
        signInOrRegisterService.signInOrRegister({
          email,
          password,
        }),
      ).rejects.toThrow('mock-error');

      expect(mockQueryRunner.startTransaction).toHaveBeenCalledTimes(1);
      expect(mockUserRepositoryFindOne).toHaveBeenCalledWith({ email });
      expect(mockUserRepositoryCreate).toHaveBeenCalledWith(
        { email, role: UserRoleEnum.USER },
        { manager: mockManager },
      );
      expect(mockAuthSignUp).toHaveBeenCalledWith(email, password);
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.release).toHaveBeenCalledTimes(1);
    });
  });
});
