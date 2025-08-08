import { IRoleMiddleware } from '../role/role-middleware.interface';

export interface IMockRoleMiddleware extends IRoleMiddleware {
  validateUserRole: () => jest.Mock;
}

class MockRoleMiddleware implements IMockRoleMiddleware {
  validateUserRole = () => jest.fn();
}

export const createMockRoleMiddleware = (): IMockRoleMiddleware => {
  return new MockRoleMiddleware();
};
