/* eslint-disable @typescript-eslint/no-explicit-any */

import { UserRoleEnum } from '../../enums';
import { IJwtMiddleware } from './jwt-middleware.interface';
import { createJwtMiddleware } from './jwt.middleware';
import { IMockAuth, createMockAuth } from '../../auth/mocks';
import {
  IMockUserRepository,
  createMockUserRepository,
} from '../../repositories/mocks';

describe('JwtMiddleware', () => {
  let mockUserRepository: IMockUserRepository;
  let mockAuth: IMockAuth;
  let jwtMiddleware: IJwtMiddleware;

  beforeEach(() => {
    mockUserRepository = createMockUserRepository();
    mockAuth = createMockAuth();
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

    it('success - pick token role', async () => {
      const ctx = {
        headers: {
          authorization: 'Bearer token',
        },
        state: {},
      } as any;

      const next = jest.fn();

      mockAuth.decodeToken.mockResolvedValueOnce({
        email: 'mock@test.com',
        roles: [UserRoleEnum.ADMIN],
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
