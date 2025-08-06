import { Exception } from './exception';

export class BearerTokenNotFoundException extends Exception {
  constructor() {
    super({
      status: 401,
      errorCode: 'auth.beare_token_not_found',
      message: 'bearer token not found',
    });
  }
}
