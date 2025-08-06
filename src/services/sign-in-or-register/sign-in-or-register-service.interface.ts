import {
  SignInOrRegisterRequestDto,
  SignInOrRegisterResponseDto,
} from '../../dtos';

export interface ISignInOrRegisterService {
  signInOrRegister(
    dto: SignInOrRegisterRequestDto,
  ): Promise<SignInOrRegisterResponseDto>;
}
