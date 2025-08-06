import Application from 'koa';
import { UserRoleEnum } from '../../enums';

export interface IRoleMiddleware {
  validateUserRole(
    allowedUserRoles: UserRoleEnum[],
  ): (
    ctx: Application.ParameterizedContext,
    next: Application.Next,
  ) => Promise<void>;
}
