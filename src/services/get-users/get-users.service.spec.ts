import { UserRoleEnum } from '../../enums';
import {
  IMockUserRepository,
  createMockUserRepository,
} from '../../repositories/mocks';
import { IGetUsersService } from './get-users.service.interface';
import { createGetUsersService } from './get-users.service';

describe('GetUsersService', () => {
  let mockUserRepository: IMockUserRepository;
  let getUsersService: IGetUsersService;

  beforeEach(() => {
    mockUserRepository = createMockUserRepository();
    getUsersService = createGetUsersService(mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('return user data when found it', async () => {
      const query = {
        page: 1,
        itemsPerPage: 10,
      };

      const createdAt = new Date();
      const updatedAt = new Date();
      mockUserRepository.findAndCount.mockResolvedValueOnce({
        data: [
          {
            id: '1',
            name: 'Andre Aguero',
            role: UserRoleEnum.ADMIN.toString(),
            isOnboarded: true,
            createdAt,
            updatedAt,
          },
        ],
        count: 1,
      });

      await expect(getUsersService.getUsers(query)).resolves.toStrictEqual({
        users: [
          {
            id: '1',
            name: 'Andre Aguero',
            isOnboarded: true,
            createdAt,
            updatedAt,
          },
        ],
        itemsInPage: 1,
        itemsPerPage: 10,
        page: 1,
        totalItems: 1,
        totalPages: 1,
      });
    });
  });
});
