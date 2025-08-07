import { Exception } from './exception';

export class AccessTokenEmptyException extends Exception {
  constructor() {
    super({
      status: 500,
      errorCode: 'auth.access_token_empty',
      message: 'access token is empty',
    });
  }
}
