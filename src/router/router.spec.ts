import { createRouter } from './router';

describe('createRouter', () => {
  const router = createRouter();

  describe('POST /auth', () => {
    const authRoute = router.stack.find((route) => route.path === '/auth');

    it('is registered', () => {
      expect(authRoute?.methods).toContain('POST');
    });
  });

  describe('POST /edit-account', () => {
    const editAccountRoute = router.stack.find(
      (route) => route.path === '/edit-account',
    );

    it('is registered', () => {
      expect(editAccountRoute?.methods).toContain('POST');
    });
  });

  describe('GET /me', () => {
    const meRoute = router.stack.find((route) => route.path === '/me');

    it('is registered', () => {
      expect(meRoute?.methods).toContain('GET');
    });
  });

  describe('GET /users', () => {
    const usersRoute = router.stack.find((route) => route.path === '/users');

    it('is registered', () => {
      expect(usersRoute?.methods).toContain('GET');
    });
  });
});
