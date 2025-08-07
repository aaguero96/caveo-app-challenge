import { Exception } from './exception';

export class TokenInvalidFormatException extends Exception {
  constructor(data: { reason: string }) {
    super({
      status: 401,
      errorCode: 'token.invalid_format',
      message: `token has invalid format. ${data.reason}`,
    });
  }
}
