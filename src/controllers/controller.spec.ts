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
    it('success case', async () => {
      const ctx = {
        request: {
          body: {},
        },
      } as any;

      mockService.signInOrRegister.mockResolvedValueOnce({});

      await controller.signInOrRegister(ctx);

      expect(mockService.signInOrRegister.mock.calls).toHaveLength(1);
      expect(ctx.body).toStrictEqual({});
      expect(ctx.status).toEqual(201);
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
          id: '',
        },
      } as any;

      mockService.getMe.mockResolvedValueOnce({});

      await controller.getMe(ctx);

      expect(mockService.getMe.mock.calls).toHaveLength(1);
      expect(ctx.body).toStrictEqual({});
      expect(ctx.status).toEqual(200);
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
