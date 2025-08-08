import { IValidateQueryMiddleware } from '../validate-query/validate-query-middleware.interface';

export interface IMockValidateQueryMiddleware extends IValidateQueryMiddleware {
  validateQuery: () => jest.Mock;
}

class MockValidateQueryMiddleware implements IMockValidateQueryMiddleware {
  validateQuery = () => jest.fn();
}

export const createMockValidateQueryMiddleware =
  (): IMockValidateQueryMiddleware => {
    return new MockValidateQueryMiddleware();
  };
