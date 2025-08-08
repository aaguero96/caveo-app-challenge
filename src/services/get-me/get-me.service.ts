import { GetMeResponseDto } from '../../dtos';
import { EntityNotFoundException } from '../../exceptions';
import { IUserRepository } from '../../repositories/user/user-repository.interface';
import { IGetMeService } from './get-me-service.interface';

export const createGetMeService = (
  userRepository: IUserRepository,
): IGetMeService => {
  return new GetMeService(userRepository);
};

class GetMeService implements IGetMeService {
  constructor(private readonly _userRepository: IUserRepository) {}

  getMe = async (userId: string): Promise<GetMeResponseDto> => {
    const user = await this._userRepository.findOne({ id: userId });
    if (!user) {
      throw new EntityNotFoundException({ tableName: 'User' });
    }

    return {
      id: user.id,
      name: user.name,
      role: user.role,
      isOnboarded: user.isOnboarded,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  };
}
