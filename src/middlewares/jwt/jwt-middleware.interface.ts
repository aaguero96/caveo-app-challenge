import { Next, ParameterizedContext } from 'koa';

export interface IJwtMiddleware {
  validateBearerToken(ctx: ParameterizedContext, next: Next): Promise<void>;
}
