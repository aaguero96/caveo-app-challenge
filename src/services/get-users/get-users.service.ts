import { GetUsersQueryDto, GetUsersResponseDto } from '../../dtos';
import { IUserRepository } from '../../repositories/user/user-repository.interface';
import { IGetUsersService } from './get-users.service.interface';

export const createGetUsersService = (
  userRepository: IUserRepository,
): IGetUsersService => {
  return new GetUsersService(userRepository);
};

class GetUsersService implements IGetUsersService {
  constructor(private readonly _userRepository: IUserRepository) {}

  getUsers = async (query: GetUsersQueryDto): Promise<GetUsersResponseDto> => {
    const skip = (query.page - 1) * query.itemsPerPage;
    const take = query.itemsPerPage;

    const { count, data } = await this._userRepository.findAndCount(
      {},
      { take, skip, order: { createdAt: 'DESC' } },
    );

    const totalPages = Math.ceil(count / query.itemsPerPage);

    return {
      users: data.map((item) => ({
        id: item.id,
        name: item.name,
        isOnboarded: item.isOnboarded,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
      itemsInPage: data.length,
      itemsPerPage: query.itemsPerPage,
      page: query.page,
      totalItems: count,
      totalPages,
    };
  };
}
