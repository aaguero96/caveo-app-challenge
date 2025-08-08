import { ParameterizedContext, Next, DefaultContext, DefaultState } from 'koa';
import { IValidateQueryMiddleware } from './validate-query-middleware.interface';
import z from 'zod';
import { ZodExcepiton } from '../../exceptions';
import { handleExceptionResponse } from '../../utils';

export const createValidatieQueryMiddleware = () => {
  return new ValidateQueryMiddleware();
};

class ValidateQueryMiddleware implements IValidateQueryMiddleware {
  constructor() {}

  validateQuery = (
    schema: z.ZodObject,
  ): ((ctx: ParameterizedContext, next: Next) => Promise<void>) => {
    return async (
      ctx: ParameterizedContext<DefaultState, DefaultContext>,
      next: Next,
    ): Promise<void> => {
      try {
        const result = schema.safeParse(ctx.query);
        if (!result.success) {
          throw new ZodExcepiton(result.error);
        }

        ctx.state.query = result.data;
        await next();
      } catch (err) {
        handleExceptionResponse(err, ctx);
        return;
      }
    };
  };
}
