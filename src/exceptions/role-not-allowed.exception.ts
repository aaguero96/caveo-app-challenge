import { UserRoleEnum } from '../enums';
import { Exception } from './exception';

export class RoleNotAllowedException extends Exception {
  constructor(data: { userRole: UserRoleEnum }) {
    super({
      status: 403,
      errorCode: 'auth.role_not_allowed',
      message: `role "${data.userRole}" is not allowed`,
    });
  }
}
