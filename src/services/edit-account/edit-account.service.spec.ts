/* eslint-disable @typescript-eslint/no-explicit-any */

import { createEditAccountService } from './edit-account.service';

describe('EditAccountService', () => {
  const editAccountService = createEditAccountService();

  describe('editAccount', () => {
    it('Method not implemented.', async () => {
      const dto = {} as any;

      await expect(editAccountService.editAccount(dto)).rejects.toThrow(
        'Method not implemented.',
      );
    });
  });
});
