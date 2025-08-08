import { UserRoleEnum } from '../../enums';
import { IGetMeService } from './get-me-service.interface';
import { createGetMeService } from './get-me.service';
import {
  IMockUserRepository,
  createMockUserRepository,
} from '../../repositories/mocks';

describe('GetMeService', () => {
  let mockUserRepository: IMockUserRepository;
  let getMeService: IGetMeService;

  beforeEach(() => {
    mockUserRepository = createMockUserRepository();
    getMeService = createGetMeService(mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getMe', () => {
    it('error when user not found', async () => {
      const userId = '1';

      await expect(getMeService.getMe(userId)).rejects.toThrow(
        'User not found',
      );
    });

    it('return user data when found it', async () => {
      const userId = '1';

      const createdAt = new Date();
      const updatedAt = new Date();
      mockUserRepository.findOne.mockResolvedValueOnce({
        id: '1',
        name: 'Andre Aguero',
        role: UserRoleEnum.ADMIN,
        isOnboarded: true,
        createdAt,
        updatedAt,
      });

      await expect(getMeService.getMe(userId)).resolves.toStrictEqual({
        id: '1',
        name: 'Andre Aguero',
        role: UserRoleEnum.ADMIN.toString(),
        isOnboarded: true,
        createdAt,
        updatedAt,
      });
    });
  });
});
