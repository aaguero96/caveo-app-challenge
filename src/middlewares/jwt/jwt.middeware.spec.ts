/* eslint-disable @typescript-eslint/no-explicit-any */

import { IJwtMiddleware } from './jwt-middleware.interface';
import { createJwtMiddleware } from './jwt.middleware';

describe('JwtMiddleware', () => {
  let jwtMiddleware: IJwtMiddleware;

  beforeEach(() => {
    jwtMiddleware = createJwtMiddleware();
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

      expect(jwtMiddleware.validateBearerToken(ctx, next)).rejects.toThrow(
        'field "authorization" not found in headers',
      );
    });

    it('error when Bearer token not found (_ + token)', async () => {
      const ctx = {
        headers: {
          authorization: 'token',
        },
      } as any;

      const next = jest.fn();

      expect(jwtMiddleware.validateBearerToken(ctx, next)).rejects.toThrow(
        'bearer token not found',
      );
    });

    it('error when Bearer token not found (Bearer + _)', async () => {
      const ctx = {
        headers: {
          authorization: 'token',
        },
      } as any;

      const next = jest.fn();

      expect(jwtMiddleware.validateBearerToken(ctx, next)).rejects.toThrow(
        'bearer token not found',
      );
    });

    it('success', async () => {
      const ctx = {
        headers: {
          authorization: 'Bearer token',
        },
      } as any;

      const next = jest.fn();

      await jwtMiddleware.validateBearerToken(ctx, next);

      expect(next.mock.calls).toHaveLength(1);
    });
  });
});
