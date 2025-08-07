import { ParameterizedContext, Next, DefaultContext } from 'koa';
import { IValidateRequestMiddleware } from './validate-request-middleware.interface';
import z from 'zod';
import { UserState } from '../../states/user.state';
import { ZodExcepiton } from '../../exceptions';
import { handleExceptionResponse } from '../../utils';

export const createValidatieRequestMiddleware = () => {
  return new ValidateRequestMiddleware();
};

class ValidateRequestMiddleware implements IValidateRequestMiddleware {
  constructor() {}

  validateRequest = (
    schema: z.ZodObject,
  ): ((ctx: ParameterizedContext, next: Next) => Promise<void>) => {
    return async (
      ctx: ParameterizedContext<UserState, DefaultContext>,
      next: Next,
    ): Promise<void> => {
      try {
        const result = schema.safeParse(ctx.request.body);
        if (!result.success) {
          throw new ZodExcepiton(result.error);
        }

        ctx.request.body = result.data;
        await next();
      } catch (err) {
        handleExceptionResponse(err, ctx);
        return;
      }
    };
  };
}
