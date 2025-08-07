import { Exception } from './exception';

export class InvalidParameterFormatException extends Exception {
  constructor(data: { invalidFormatMessage: string }) {
    super({
      status: 400,
      errorCode: 'parameter.invalid_format',
      message: `parameter format is invalid. ${data.invalidFormatMessage}`,
    });
  }
}
