import { ParameterizedContext, Next, DefaultContext, DefaultState } from 'koa';
import { UserRoleEnum } from '../../enums';
import { IRoleMiddleware } from './role-middleware.interface';
import { UserState } from '../../states/user.state';
import {
  RoleNotAllowedException,
  RoleNotFoundException,
} from '../../exceptions';

export const createRoleMiddleware = (): IRoleMiddleware => {
  return new RoleMiddleware();
};

class RoleMiddleware implements IRoleMiddleware {
  constructor() {}

  validateUserRole = (
    allowedUserRoles: UserRoleEnum[],
  ): ((ctx: ParameterizedContext, next: Next) => Promise<void>) => {
    return async (
      ctx: ParameterizedContext<
        DefaultState & { user: UserState },
        DefaultContext
      >,
      next: Next,
    ): Promise<void> => {
      const role = ctx.state.user.role;
      if (!role) {
        throw new RoleNotFoundException();
      }

      if (!allowedUserRoles.includes(role)) {
        throw new RoleNotAllowedException({ userRole: role });
      }

      await next();
    };
  };
}
