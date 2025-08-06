/* eslint-disable @typescript-eslint/no-explicit-any */

import { IController } from '../controllers/controller.interface';
import { createRouter } from './router';
import {} from 'jest';

describe('createRouter', () => {
  class MockController implements IController {
    signInOrRegister = jest.fn();
    editAccount = jest.fn();
    getMe = jest.fn();
    getUsers = jest.fn();
  }

  const mockController = new MockController();

  const router = createRouter(mockController);

  describe('POST /api/auth', () => {
    const authRoute = router.stack.find((route) => route.path === '/api/auth');

    it('is registered', () => {
      expect(authRoute).not.toBeUndefined();
      expect(authRoute?.methods).toContain('POST');
    });

    it('implement controller signInOrRegister', () => {
      const context = {} as any;
      const next = {} as any;
      authRoute?.stack[0](context, next);
      expect(mockController.signInOrRegister.mock.calls).toHaveLength(1);
    });
  });

  describe('POST /api/edit-account', () => {
    const editAccountRoute = router.stack.find(
      (route) => route.path === '/api/edit-account',
    );

    it('is registered', () => {
      expect(editAccountRoute).not.toBeUndefined();
      expect(editAccountRoute?.methods).toContain('POST');
    });
  });

  describe('GET /api/me', () => {
    const meRoute = router.stack.find((route) => route.path === '/api/me');

    it('is registered', () => {
      expect(meRoute).not.toBeUndefined();
      expect(meRoute?.methods).toContain('GET');
    });
  });

  describe('GET /api/users', () => {
    const usersRoute = router.stack.find(
      (route) => route.path === '/api/users',
    );

    it('is registered', () => {
      expect(usersRoute).not.toBeUndefined();
      expect(usersRoute?.methods).toContain('GET');
    });
  });
});
