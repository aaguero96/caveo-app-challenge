import { Exception } from './exception';

export class BearerTokenNotFoundException extends Exception {
  constructor() {
    super({
      status: 401,
      errorCode: 'auth.bearer_token_not_found',
      message: 'bearer token not found',
    });
  }
}
