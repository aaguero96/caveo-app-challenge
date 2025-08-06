import { EditAccountResponseDto } from '../../dtos';
import { IEditAccountService } from './edit-account-service.interface';

export const createEditAccountService = (): IEditAccountService => {
  return new EditAccountService();
};

class EditAccountService implements IEditAccountService {
  constructor() {}

  editAccount = async (userId: string): Promise<EditAccountResponseDto> => {
    throw new Error('Method not implemented.');
  };
}
