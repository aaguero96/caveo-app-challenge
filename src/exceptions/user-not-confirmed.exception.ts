import { Exception } from './exception';

export class UserNotConfirmedException extends Exception {
  constructor() {
    super({
      status: 401,
      errorCode: 'user.not_confirmed',
      message: 'user not confirmed',
    });
  }
}
