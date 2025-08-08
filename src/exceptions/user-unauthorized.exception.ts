import { Exception } from './exception';

export class UserUnauthorizedException extends Exception {
  constructor() {
    super({
      status: 401,
      errorCode: 'user.unauthorized',
      message: 'user is unauthorized',
    });
  }
}
