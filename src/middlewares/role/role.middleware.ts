import { ParameterizedContext, Next, DefaultContext, DefaultState } from 'koa';
import { UserRoleEnum } from '../../enums';
import { IRoleMiddleware } from './role-middleware.interface';
import {
  RoleNotAllowedException,
  RoleNotFoundException,
} from '../../exceptions';
import { UserEntity } from '../../entities';

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
        DefaultState & { user: UserEntity },
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
