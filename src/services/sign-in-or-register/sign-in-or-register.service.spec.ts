/* eslint-disable @typescript-eslint/no-explicit-any */

import { createSignInOrRegosterService } from './sign-in-or-register.service';

describe('GetMeService', () => {
  const editAccountService = createSignInOrRegosterService();

  describe('signInOrRegister', () => {
    it('Method not implemented.', async () => {
      const dto = {} as any;

      await expect(editAccountService.signInOrRegister(dto)).rejects.toThrow(
        'Method not implemented.',
      );
    });
  });
});
