import { IJwtMiddleware } from '../jwt/jwt-middleware.interface';

export interface IMockJwtMiddleware extends IJwtMiddleware {
  validateBearerToken: jest.Mock;
}

class MockJwtMiddleware implements IMockJwtMiddleware {
  validateBearerToken = jest.fn();
}

export const createMockJwtMiddleware = (): IMockJwtMiddleware => {
  return new MockJwtMiddleware();
};
