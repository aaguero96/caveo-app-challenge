import { IAuth } from './auth.interface';
import { createAuth } from './auth';

describe('Auth', () => {
  let auth: IAuth;

  beforeEach(() => {
    auth = createAuth();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    it('Method not implemented.', async () => {
      const email = '';
      const password = '';

      await expect(auth.signIn(email, password)).rejects.toThrow(
        'Method not implemented.',
      );
    });
  });

  describe('signUp', () => {
    it('Method not implemented.', async () => {
      const email = '';
      const password = '';

      await expect(auth.signUp(email, password)).rejects.toThrow(
        'Method not implemented.',
      );
    });
  });

  describe('validate', () => {
    it('Method not implemented.', async () => {
      const token = '';

      await expect(auth.validate(token)).rejects.toThrow(
        'Method not implemented.',
      );
    });
  });
});
