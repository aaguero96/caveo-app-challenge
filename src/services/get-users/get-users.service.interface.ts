import { GetUsersQueryDto, GetUsersResponseDto } from '../../dtos';

export interface IGetUsersService {
  getUsers(query: GetUsersQueryDto): Promise<GetUsersResponseDto>;
}
