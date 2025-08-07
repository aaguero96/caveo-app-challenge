import { Exception } from './exception';

export class UserAlreadyBeenCreatedException extends Exception {
  constructor() {
    super({
      status: 409,
      errorCode: 'user.already_been_confirmed',
      message: 'user has already been confirmed',
    });
  }
}
