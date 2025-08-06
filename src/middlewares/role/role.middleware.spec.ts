/* eslint-disable @typescript-eslint/no-explicit-any */

import { UserRoleEnum } from '../../enums';
import { IRoleMiddleware } from './role-middleware.interface';
import { createRoleMiddleware } from './role.middleware';

describe('RoleMiddleware', () => {
  let roleMiddleware: IRoleMiddleware;

  beforeEach(() => {
    roleMiddleware = createRoleMiddleware();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUserRole', () => {
    it('error when role not found in ctx state', async () => {
      const ctx = {
        state: {},
      } as any;

      const next = jest.fn();

      expect(
        roleMiddleware.validateUserRole([UserRoleEnum.ADMIN])(ctx, next),
      ).rejects.toThrow('user should have a role');
    });

    it('error when role not allowed', async () => {
      const ctx = {
        state: {
          role: UserRoleEnum.USER,
        },
      } as any;

      const next = jest.fn();

      expect(
        roleMiddleware.validateUserRole([UserRoleEnum.ADMIN])(ctx, next),
      ).rejects.toThrow('role "usuário" is not allowed');
    });

    it('success', async () => {
      const ctx = {
        state: {
          role: UserRoleEnum.ADMIN,
        },
      } as any;

      const next = jest.fn();

      await roleMiddleware.validateUserRole([UserRoleEnum.ADMIN])(ctx, next);

      expect(next.mock.calls).toHaveLength(1);
    });
  });
});
