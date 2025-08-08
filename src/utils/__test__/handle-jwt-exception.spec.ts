import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { handleJwtException } from '..';
import {
  TokenExpiredException,
  TokenInvalidFormatException,
} from '../../exceptions';

describe('handleJwtException', () => {
  it('return equivalent when is instanceof JsonWebTokenError', () => {
    const response = handleJwtException(new JsonWebTokenError(''));

    expect(response).toBeInstanceOf(TokenInvalidFormatException);
  });

  it('return equivalent when is instanceof TokenExpiredError', () => {
    const response = handleJwtException(new TokenExpiredError('', new Date()));

    expect(response).toBeInstanceOf(TokenExpiredException);
  });

  it('return undefined when error is generic', () => {
    const response = handleJwtException(new Error('mock-error'));

    expect(response).toBeUndefined();
  });
});
