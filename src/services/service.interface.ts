import {
  EditAccountRequestDto,
  EditAccountResponseDto,
  GetMeResponseDto,
  GetUsersQueryDto,
  GetUsersResponseDto,
  SignInOrRegisterRequestDto,
  SignInOrRegisterResponseDto,
} from '../dtos';

export interface IService {
  signInOrRegister(
    dto: SignInOrRegisterRequestDto,
  ): Promise<SignInOrRegisterResponseDto>;
  editAccount(dto: EditAccountRequestDto): Promise<EditAccountResponseDto>;
  getMe(userId: string): Promise<GetMeResponseDto>;
  getUsers(query: GetUsersQueryDto): Promise<GetUsersResponseDto>;
}
