import { createGetMeService } from './get-me.service';

describe('GetMeService', () => {
  const editAccountService = createGetMeService();

  describe('getMe', () => {
    it('Method not implemented.', async () => {
      const userId = '';

      await expect(editAccountService.getMe(userId)).rejects.toThrow(
        'Method not implemented.',
      );
    });
  });
});
