/* eslint-disable @typescript-eslint/no-explicit-any */

import { createGetUsersService } from './get-users.service';

describe('GetMeService', () => {
  const editAccountService = createGetUsersService();

  describe('getMe', () => {
    it('Method not implemented.', async () => {
      const query = {} as any;

      await expect(editAccountService.getUsers(query)).rejects.toThrow(
        'Method not implemented.',
      );
    });
  });
});
