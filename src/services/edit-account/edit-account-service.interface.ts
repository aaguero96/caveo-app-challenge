import { EditAccountRequestDto, EditAccountResponseDto } from '../../dtos';
import { UserEntity } from '../../entities';

export interface IEditAccountService {
  editAccount(
    ctxUser: UserEntity,
    dto: EditAccountRequestDto,
  ): Promise<EditAccountResponseDto>;
}
