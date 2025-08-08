import { Next, ParameterizedContext } from 'koa';
import { z } from 'zod';

export interface IValidateQueryMiddleware {
  validateQuery(
    schema: z.ZodObject,
  ): (ctx: ParameterizedContext, next: Next) => Promise<void>;
}
