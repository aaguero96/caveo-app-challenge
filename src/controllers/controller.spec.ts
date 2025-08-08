/* eslint-disable @typescript-eslint/no-explicit-any */

import { createController } from './controller';
import { IController } from './controller.interface';
import { createMockService, IMockService } from '../services/mocks';
import { UserRoleEnum } from '../enums';

describe('Controller', () => {
  let mockService: IMockService;
  let controller: IController;

  beforeEach(() => {
    mockService = createMockService();
    controller = createController(mockService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signInOrRegister', () => {
    it('success case - when register', async () => {
      const ctx = {
        request: {
          body: {},
        },
      } as any;

      mockService.signInOrRegister.mockResolvedValueOnce({ status: 201 });

      await controller.signInOrRegister(ctx);

      expect(mockService.signInOrRegister.mock.calls).toHaveLength(1);
      expect(ctx.body).toStrictEqual({ status: 201 });
      expect(ctx.status).toEqual(201);
    });

    it('success case - when already been registered', async () => {
      const ctx = {
        request: {
          body: {},
        },
      } as any;

      mockService.signInOrRegister.mockResolvedValueOnce({
        status: 200,
      });

      await controller.signInOrRegister(ctx);

      expect(mockService.signInOrRegister.mock.calls).toHaveLength(1);
      expect(ctx.body).toStrictEqual({ status: 200 });
      expect(ctx.status).toEqual(200);
    });

    it('error case', async () => {
      const ctx = {
        request: {
          body: {},
        },
      } as any;

      mockService.signInOrRegister.mockRejectedValueOnce(
        new Error('mock-error'),
      );

      await controller.signInOrRegister(ctx);

      expect(mockService.signInOrRegister.mock.calls).toHaveLength(1);
      expect(ctx.body).toStrictEqual({
        status: 500,
        errorCode: 'internal_server_error',
        message: 'mock-error',
        body: new Error('mock-error'),
      });
      expect(ctx.status).toEqual(500);
    });
  });

  describe('editAccount', () => {
    it('success case with userId - admin', async () => {
      const ctx = {
        state: {
          user: {
            id: '1',
            role: UserRoleEnum.ADMIN,
          },
        },
        request: {
          body: {
            userId: '1',
          },
        },
      } as any;

      mockService.editAccount.mockResolvedValueOnce({});

      await controller.editAccount(ctx);

      expect(mockService.editAccount.mock.calls).toHaveLength(1);
      expect(ctx.body).toStrictEqual({});
      expect(ctx.status).toEqual(200);
    });

    it('success case without userId - admin', async () => {
      const ctx = {
        state: {
          user: {
            id: '1',
            role: UserRoleEnum.ADMIN,
          },
        },
        request: {
          body: {},
        },
      } as any;

      mockService.editAccount.mockResolvedValueOnce({});

      await controller.editAccount(ctx);

      expect(mockService.editAccount.mock.calls).toHaveLength(1);
      expect(ctx.body).toStrictEqual({});
      expect(ctx.status).toEqual(200);
    });

    it('success case with valid userId - user', async () => {
      const ctx = {
        state: {
          user: {
            id: '1',
            role: UserRoleEnum.USER,
          },
        },
        request: {
          body: {
            userId: '1',
          },
        },
      } as any;

      mockService.editAccount.mockResolvedValueOnce({});

      await controller.editAccount(ctx);

      expect(mockService.editAccount.mock.calls).toHaveLength(1);
      expect(ctx.body).toStrictEqual({});
      expect(ctx.status).toEqual(200);
    });

    it('success case without userId - user', async () => {
      const ctx = {
        state: {
          user: {
            id: '1',
            role: UserRoleEnum.USER,
          },
        },
        request: {
          body: {},
        },
      } as any;

      mockService.editAccount.mockResolvedValueOnce({});

      await controller.editAccount(ctx);

      expect(mockService.editAccount.mock.calls).toHaveLength(1);
      expect(ctx.body).toStrictEqual({});
      expect(ctx.status).toEqual(200);
    });

    it('error when userId is not valid - user', async () => {
      const ctx = {
        state: {
          user: {
            id: '1',
            role: UserRoleEnum.USER,
          },
        },
        request: {
          body: {
            userId: '2',
          },
        },
      } as any;

      await controller.editAccount(ctx);

      expect(ctx.body).toStrictEqual({
        status: 401,
        errorCode: 'auth.user_role_permission',
        message: 'role "usuário" shouldnt update others',
        body: undefined,
      });
      expect(ctx.status).toEqual(401);
    });

    it('error case - generic', async () => {
      const ctx = {
        state: {
          user: {},
        },
        request: {
          body: {},
        },
      } as any;

      mockService.editAccount.mockRejectedValueOnce(new Error('mock-error'));

      await controller.editAccount(ctx);

      expect(mockService.editAccount.mock.calls).toHaveLength(1);
      expect(ctx.body).toStrictEqual({
        status: 500,
        errorCode: 'internal_server_error',
        message: 'mock-error',
        body: new Error('mock-error'),
      });
      expect(ctx.status).toEqual(500);
    });
  });

  describe('getMe', () => {
    it('success case', async () => {
      const ctx = {
        state: {
          user: {
            id: '',
          },
        },
      } as any;

      mockService.getMe.mockResolvedValueOnce({});

      await controller.getMe(ctx);

      expect(mockService.getMe.mock.calls).toHaveLength(1);
      expect(ctx.body).toStrictEqual({});
      expect(ctx.status).toEqual(200);
    });

    it('error case - user not in state', async () => {
      const ctx = {
        state: {},
      } as any;

      await controller.getMe(ctx);

      expect(ctx.body).toStrictEqual({
        status: 401,
        errorCode: 'user.unauthorized',
        message: 'user is unauthorized',
        body: undefined,
      });
      expect(ctx.status).toEqual(401);
    });

    it('error case - generic error', async () => {
      const ctx = {
        state: {
          user: {
            id: '',
          },
        },
      } as any;

      mockService.getMe.mockRejectedValueOnce(new Error('mock-error'));

      await controller.getMe(ctx);

      // expect(mockService.getMe.mock.calls).toHaveLength(1);
      expect(ctx.body).toStrictEqual({
        status: 500,
        errorCode: 'internal_server_error',
        message: 'mock-error',
        body: new Error('mock-error'),
      });
      expect(ctx.status).toEqual(500);
    });
  });

  describe('getUsers', () => {
    it('success case', async () => {
      const ctx = {
        state: {
          user: {},
        },
      } as any;

      mockService.getUsers.mockResolvedValueOnce({});

      await controller.getUsers(ctx);

      expect(mockService.getUsers.mock.calls).toHaveLength(1);
      expect(ctx.body).toStrictEqual({});
      expect(ctx.status).toEqual(200);
    });

    it('error case', async () => {
      const ctx = {
        state: {
          user: {},
        },
      } as any;

      mockService.getUsers.mockRejectedValueOnce(new Error('mock-error'));

      await controller.getUsers(ctx);

      expect(mockService.getUsers.mock.calls).toHaveLength(1);
      expect(ctx.body).toStrictEqual({
        status: 500,
        errorCode: 'internal_server_error',
        message: 'mock-error',
        body: new Error('mock-error'),
      });
      expect(ctx.status).toEqual(500);
    });
  });
});
