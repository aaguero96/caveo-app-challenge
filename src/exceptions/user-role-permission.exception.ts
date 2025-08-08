import { UserRoleEnum } from '../enums';
import { Exception } from './exception';

export class UserRolePermissionException extends Exception {
  constructor(data: { role: UserRoleEnum; permissionError: string }) {
    super({
      status: 401,
      errorCode: 'auth.user_role_permission',
      message: `role "${data.role}" ${data.permissionError}`,
    });
  }
}
