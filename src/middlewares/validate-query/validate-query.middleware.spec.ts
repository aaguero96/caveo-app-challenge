/* eslint-disable @typescript-eslint/no-explicit-any */

import z from 'zod';
import { IValidateQueryMiddleware } from './validate-query-middleware.interface';
import { createValidatieQueryMiddleware } from './validate-query.middleware';
import { handleExceptionResponse } from '../../utils';

jest.mock('../../utils');

describe('ValidateQueryMiddleware', () => {
  let validateQueryMiddleware: IValidateQueryMiddleware;

  beforeEach(() => {
    validateQueryMiddleware = createValidatieQueryMiddleware();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateQuery', () => {
    it('error when schema is not followed', async () => {
      const ctx = {
        query: {
          email: 'test',
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

      await validateQueryMiddleware.validateQuery(schema)(ctx, next);

      expect(ctx.status).toBe(400);
      expect(ctx.body).toStrictEqual({
        message: 'email_invalid',
      });
    });

    it('success', async () => {
      const ctx = {
        query: {
          email: 'test@gmail.com',
        },
        state: {
          query: {},
        },
      } as any;

      const next = jest.fn();

      const schema = z.object({
        email: z.email(),
      });

      await validateQueryMiddleware.validateQuery(schema)(ctx, next);

      expect(next.mock.calls).toHaveLength(1);
    });
  });
});
