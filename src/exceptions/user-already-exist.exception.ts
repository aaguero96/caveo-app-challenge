import { Exception } from './exception';

export class UserAlreadyExistException extends Exception {
  constructor() {
    super({
      status: 409,
      errorCode: 'user.already_exists',
      message: 'user already exists',
    });
  }
}
