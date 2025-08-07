import { Exception } from './exception';

export class InvalidPasswordFormatException extends Exception {
  constructor() {
    super({
      status: 400,
      errorCode: 'password.invalid_format',
      message: 'password has invalid format',
    });
  }
}
