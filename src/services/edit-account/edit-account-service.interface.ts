import { EditAccountResponseDto } from '../../dtos';

export interface IEditAccountService {
  editAccount(userId: string): Promise<EditAccountResponseDto>;
}
