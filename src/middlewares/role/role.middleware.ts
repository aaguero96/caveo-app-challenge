import { ParameterizedContext, Next, DefaultContext } from 'koa';
import { UserRoleEnum } from '../../enums';
import { IRoleMiddleware } from './role-middleware.interface';
import { UserState } from '../../states/user.state';
import { RoleNotFoundException } from '../../exceptions/role-not-found.exception';
import { RoleNotAllowedException } from '../../exceptions/role-not-allowed.exception';

export const createRoleMiddleware = (): IRoleMiddleware => {
  return new RoleMiddleware();
};

class RoleMiddleware implements IRoleMiddleware {
  constructor() {}

  validateUserRole = (
    allowedUserRoles: UserRoleEnum[],
  ): ((ctx: ParameterizedContext, next: Next) => Promise<void>) => {
    return async (
      ctx: ParameterizedContext<UserState, DefaultContext>,
      next: Next,
    ): Promise<void> => {
      const role = ctx.state.role;
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
