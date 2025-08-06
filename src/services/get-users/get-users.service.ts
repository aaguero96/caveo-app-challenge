import { GetUsersQueryDto, GetUsersResponseDto } from '../../dtos';
import { IGetUsersService } from './get-users.service.interface';

export const createGetUsersService = (): IGetUsersService => {
  return new GetUsersService();
};

class GetUsersService implements IGetUsersService {
  constructor() {}

  getUsers = async (query: GetUsersQueryDto): Promise<GetUsersResponseDto> => {
    throw new Error('Method not implemented.');
  };
}
