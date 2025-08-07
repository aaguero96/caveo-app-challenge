import { Next, ParameterizedContext } from 'koa';
import { z } from 'zod';

export interface IValidateRequestMiddleware {
  validateRequest(
    schema: z.ZodObject,
  ): (ctx: ParameterizedContext, next: Next) => Promise<void>;
}
