import { ParameterizedContext, Next } from 'koa';
import { IJwtMiddleware } from './jwt-middleware.interface';
import {
  AuthorizationHeaderNotFoundException,
  BearerTokenNotFoundException,
} from '../../exceptions';

export const createJwtMiddleware = (): IJwtMiddleware => {
  return new JwtMiddleware();
};

class JwtMiddleware implements IJwtMiddleware {
  constructor() {}

  validateBearerToken = async (
    ctx: ParameterizedContext,
    next: Next,
  ): Promise<void> => {
    const authHeader = ctx.headers['authorization'];
    if (!authHeader) {
      throw new AuthorizationHeaderNotFoundException();
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new BearerTokenNotFoundException();
    }

    await next();
  };
}
