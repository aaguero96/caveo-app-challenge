import {
  EditAccountRequestDto,
  EditAccountResponseDto,
  GetMeResponseDto,
  GetUsersQueryDto,
  GetUsersResponseDto,
  SignInOrRegisterRequestDto,
  SignInOrRegisterResponseDto,
} from '../dtos';
import { UserEntity } from '../entities';

export interface IService {
  signInOrRegister(
    dto: SignInOrRegisterRequestDto,
  ): Promise<SignInOrRegisterResponseDto>;
  editAccount(
    ctxUser: UserEntity,
    dto: EditAccountRequestDto,
  ): Promise<EditAccountResponseDto>;
  getMe(userId: string): Promise<GetMeResponseDto>;
  getUsers(query: GetUsersQueryDto): Promise<GetUsersResponseDto>;
}
