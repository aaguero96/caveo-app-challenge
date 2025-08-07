import { Exception } from './exception';

export class TokenExpiredException extends Exception {
  constructor(data: { expiredAt: Date }) {
    super({
      status: 401,
      errorCode: 'token.exprired',
      message: `token was expired ${data.expiredAt}`,
    });
  }
}
