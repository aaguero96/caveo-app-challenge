import { GetMeResponseDto } from '../../dtos';

export interface IGetMeService {
  getMe(userId: string): Promise<GetMeResponseDto>;
}
