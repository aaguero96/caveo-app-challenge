/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  createMockJwtMiddleware,
  createMockRoleMiddleware,
  createMockValidateRequestMiddleware,
} from '../middlewares/mocks';
import { createMockController } from '../controllers/mocks';
import { createRouter } from './router';

describe('createRouter', () => {
  const mockController = createMockController();
  const mockJwtMiddleware = createMockJwtMiddleware();
  const mockRoleMiddleware = createMockRoleMiddleware();
  const mockValidateRequestMiddleware = createMockValidateRequestMiddleware();

  const router = createRouter(
    mockJwtMiddleware,
    mockRoleMiddleware,
    mockValidateRequestMiddleware,
    mockController,
  );

  describe('POST /api/auth', () => {
    const authRoute = router.stack.find((route) => route.path === '/api/auth');

    it('is registered', () => {
      expect(authRoute).not.toBeUndefined();
      expect(authRoute?.methods).toContain('POST');
    });

    it('implement controller signInOrRegister', () => {
      const context = {} as any;
      const next = {} as any;

      authRoute?.stack[1](context, next);
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
