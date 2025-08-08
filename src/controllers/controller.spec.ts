/* eslint-disable @typescript-eslint/no-explicit-any */

import { createController } from './controller';
import { IService } from '../services/service.interface';
import { IController } from './controller.interface';

describe('Controller', () => {
  class MockService implements IService {
    signInOrRegister = jest.fn();
    editAccount = jest.fn();
    getMe = jest.fn();
    getUsers = jest.fn();
  }

  let mockService: MockService;
  let controller: IController;

  beforeEach(() => {
    mockService = new MockService();
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
    it('success case', async () => {
      const ctx = {
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
        query: {},
      } as any;

      mockService.getUsers.mockResolvedValueOnce({});

      await controller.getUsers(ctx);

      expect(mockService.getUsers.mock.calls).toHaveLength(1);
      expect(ctx.body).toStrictEqual({});
      expect(ctx.status).toEqual(200);
    });
  });
});
