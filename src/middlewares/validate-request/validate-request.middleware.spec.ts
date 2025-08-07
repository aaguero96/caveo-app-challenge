/* eslint-disable @typescript-eslint/no-explicit-any */

import z from 'zod';
import { IValidateRequestMiddleware } from './validate-request-middleware.interface';
import { createValidatieRequestMiddleware } from './validate-request.middleware';
import { handleExceptionResponse } from '../../utils';

jest.mock('../../utils');

describe('ValidateRequestMiddleware', () => {
  let validateRequestMiddleware: IValidateRequestMiddleware;

  beforeEach(() => {
    validateRequestMiddleware = createValidatieRequestMiddleware();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateRequest', () => {
    it('error when schema is not followed', async () => {
      const ctx = {
        request: {
          body: {
            email: 'test',
          },
        },
      } as any;

      const next = jest.fn();

      const schema = z.object({
        email: z.email(),
      });

      (handleExceptionResponse as jest.Mock).mockImplementationOnce(() => {
        ctx.status = 400;
        ctx.body = {
          message: 'email_invalid',
        };
      });

      await validateRequestMiddleware.validateRequest(schema)(ctx, next);

      expect(ctx.status).toBe(400);
      expect(ctx.body).toStrictEqual({
        message: 'email_invalid',
      });
    });

    it('success', async () => {
      const ctx = {
        request: {
          body: {
            email: 'test@gmail.com',
          },
        },
      } as any;

      const next = jest.fn();

      const schema = z.object({
        email: z.email(),
      });

      await validateRequestMiddleware.validateRequest(schema)(ctx, next);

      expect(next.mock.calls).toHaveLength(1);
    });
  });
});
