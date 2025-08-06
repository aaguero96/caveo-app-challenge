import { GetMeResponseDto } from '../../dtos';
import { IGetMeService } from './get-me-service.interface';

export const createGetMeService = (): IGetMeService => {
  return new GetMeService();
};

class GetMeService implements IGetMeService {
  constructor() {}

  getMe = async (userId: string): Promise<GetMeResponseDto> => {
    throw new Error('Method not implemented.');
  };
}
