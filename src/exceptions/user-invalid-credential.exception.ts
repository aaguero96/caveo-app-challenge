import { Exception } from './exception';

export class UserInvalidCredentialException extends Exception {
  constructor() {
    super({
      status: 401,
      errorCode: 'user.invalid_credential',
      message: 'user email or password are invalid',
    });
  }
}
