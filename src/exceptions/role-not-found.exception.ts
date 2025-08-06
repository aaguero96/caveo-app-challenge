import { Exception } from './exception';

export class RoleNotFoundException extends Exception {
  constructor() {
    super({
      status: 401,
      errorCode: 'auth.role_not_found',
      message: 'user should have a role',
    });
  }
}
