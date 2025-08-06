import { Next, ParameterizedContext } from 'koa';
import { UserRoleEnum } from '../../enums';

export interface IRoleMiddleware {
  validateUserRole(
    allowedUserRoles: UserRoleEnum[],
  ): (ctx: ParameterizedContext, next: Next) => Promise<void>;
}
