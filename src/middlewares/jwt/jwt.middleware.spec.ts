/* eslint-disable @typescript-eslint/no-explicit-any */

import { IAuth } from '../../auth/auth.interface';
import { UserRoleEnum } from '../../enums';
import { IUserRepository } from '../../repositories/user/user-repository.interface';
import { IJwtMiddleware } from './jwt-middleware.interface';
import { createJwtMiddleware } from './jwt.middleware';

describe('JwtMiddleware', () => {
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

  let mockUserRepository: MockUserRepository;
  let mockAuth: MockAuth;
  let jwtMiddleware: IJwtMiddleware;

  beforeEach(() => {
    mockUserRepository = new MockUserRepository();
    mockAuth = new MockAuth();
    jwtMiddleware = createJwtMiddleware(mockAuth, mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateBearerToken', () => {
    it('error when authorization header not found', async () => {
      const ctx = {
        headers: {
          authorization: '',
        },
      } as any;

      const next = jest.fn();

      await jwtMiddleware.validateBearerToken(ctx, next);

      expect(ctx.status).toBe(401);
      expect(ctx.body).toStrictEqual({
        status: 401,
        errorCode: 'auth.authorization_header_not_found',
        message: 'field "authorization" not found in headers',
        body: undefined,
      });
    });

    it('error when Bearer token not found (_ + token)', async () => {
      const ctx = {
        headers: {
          authorization: 'token',
        },
      } as any;

      const next = jest.fn();

      await jwtMiddleware.validateBearerToken(ctx, next);

      expect(ctx.status).toBe(401);
      expect(ctx.body).toStrictEqual({
        status: 401,
        errorCode: 'auth.bearer_token_not_found',
        message: 'bearer token not found',
        body: undefined,
      });
    });

    it('error when Bearer token not found (Bearer + _)', async () => {
      const ctx = {
        headers: {
          authorization: 'token',
        },
      } as any;

      const next = jest.fn();

      await jwtMiddleware.validateBearerToken(ctx, next);

      expect(ctx.status).toBe(401);
      expect(ctx.body).toStrictEqual({
        status: 401,
        errorCode: 'auth.bearer_token_not_found',
        message: 'bearer token not found',
        body: undefined,
      });
    });

    it('error when user is not found', async () => {
      const ctx = {
        headers: {
          authorization: 'Bearer token',
        },
      } as any;

      const next = jest.fn();

      mockAuth.decodeToken.mockResolvedValueOnce({
        email: 'mock@test.com',
      });
      mockUserRepository.findOne.mockResolvedValueOnce(null);

      await jwtMiddleware.validateBearerToken(ctx, next);

      expect(ctx.status).toBe(401);
      expect(ctx.body).toStrictEqual({
        status: 401,
        errorCode: 'user.unauthorized',
        message: 'user is unauthorized',
        body: undefined,
      });
    });

    it('success', async () => {
      const ctx = {
        headers: {
          authorization: 'Bearer token',
        },
        state: {},
      } as any;

      const next = jest.fn();

      mockAuth.decodeToken.mockResolvedValueOnce({
        email: 'mock@test.com',
      });
      mockUserRepository.findOne.mockResolvedValueOnce({
        id: '1',
        role: UserRoleEnum.ADMIN,
      });

      await jwtMiddleware.validateBearerToken(ctx, next);

      expect(next).toHaveBeenCalledTimes(1);
    });
  });
});
