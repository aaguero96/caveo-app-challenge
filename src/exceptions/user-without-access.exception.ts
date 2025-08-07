import { Exception } from './exception';

export class UserWithoutAccessException extends Exception {
  constructor() {
    super({
      status: 401,
      errorCode: 'user.without_acess',
      message: 'user without access',
    });
  }
}
