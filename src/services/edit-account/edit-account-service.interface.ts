import { EditAccountRequestDto, EditAccountResponseDto } from '../../dtos';

export interface IEditAccountService {
  editAccount(dto: EditAccountRequestDto): Promise<EditAccountResponseDto>;
}
