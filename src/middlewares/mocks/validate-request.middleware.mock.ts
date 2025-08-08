import { IValidateRequestMiddleware } from '../validate-request/validate-request-middleware.interface';

export interface IMockValidateRequestMiddleware
  extends IValidateRequestMiddleware {
  validateRequest: () => jest.Mock;
}

class MockValidateRequestMiddleware implements IMockValidateRequestMiddleware {
  validateRequest = () => jest.fn();
}

export const createMockValidateRequestMiddleware =
  (): IMockValidateRequestMiddleware => {
    return new MockValidateRequestMiddleware();
  };
