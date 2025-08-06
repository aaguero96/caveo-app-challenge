import { Exception } from './exception';

export class AuthorizationHeaderNotFoundException extends Exception {
  constructor() {
    super({
      status: 401,
      errorCode: 'auth.authorization_header_not_found',
      message: 'field "authorization" not found in headers',
    });
  }
}
