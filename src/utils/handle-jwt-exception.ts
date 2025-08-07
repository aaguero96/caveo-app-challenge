import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import {
  Exception,
  TokenExpiredException,
  TokenInvalidFormatException,
} from '../exceptions';

export const handleJwtException = (err: unknown): Exception | undefined => {
  if (err instanceof TokenExpiredError) {
    return new TokenExpiredException({ expiredAt: err.expiredAt });
  }

  if (err instanceof JsonWebTokenError) {
    return new TokenInvalidFormatException({ reason: err.name });
  }
};
