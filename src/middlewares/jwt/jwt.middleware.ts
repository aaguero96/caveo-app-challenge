import { ParameterizedContext, Next } from 'koa';
import { IJwtMiddleware } from './jwt-middleware.interface';
import {
  AuthorizationHeaderNotFoundException,
  BearerTokenNotFoundException,
  UserUnauthorizedException,
} from '../../exceptions';
import { IAuth } from '../../auth/auth.interface';
import { IUserRepository } from '../../repositories/user/user-repository.interface';
import { handleExceptionResponse } from '../../utils';

export const createJwtMiddleware = (
  auth: IAuth,
  userRepository: IUserRepository,
): IJwtMiddleware => {
  return new JwtMiddleware(auth, userRepository);
};

class JwtMiddleware implements IJwtMiddleware {
  constructor(
    private readonly _auth: IAuth,
    private readonly _userRepository: IUserRepository,
  ) {}

  validateBearerToken = async (
    ctx: ParameterizedContext,
    next: Next,
  ): Promise<void> => {
    try {
      const authHeader = ctx.headers['authorization'];
      if (!authHeader) {
        throw new AuthorizationHeaderNotFoundException();
      }

      const [type, token] = authHeader.split(' ');
      if (type !== 'Bearer' || !token) {
        throw new BearerTokenNotFoundException();
      }

      const tokenData = await this._auth.decodeToken(token);

      const user = await this._userRepository.findOne({
        email: tokenData.email,
      });
      if (!user) {
        throw new UserUnauthorizedException();
      }

      if (tokenData.roles && tokenData.roles.length > 0 && tokenData.roles[0]) {
        user.role = tokenData.roles[0];
      }
      ctx.state.user = user;

      await next();
    } catch (err) {
      handleExceptionResponse(err, ctx);
      return;
    }
  };
}
