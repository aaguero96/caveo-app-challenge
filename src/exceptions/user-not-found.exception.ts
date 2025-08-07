import { Exception } from './exception';

export class UserNotFoundException extends Exception {
  constructor() {
    super({
      status: 404,
      errorCode: 'user.not_found',
      message: 'user not found',
    });
  }
}
