import {
  SignInOrRegisterRequestDto,
  SignInOrRegisterResponseDto,
} from '../../dtos';
import { ISignInOrRegisterService } from './sign-in-or-register-service.interface';

export const createSignInOrRegosterService = (): ISignInOrRegisterService => {
  return new SignInOrRegisterService();
};

class SignInOrRegisterService implements ISignInOrRegisterService {
  constructor() {}

  signInOrRegister = async (
    dto: SignInOrRegisterRequestDto,
  ): Promise<SignInOrRegisterResponseDto> => {
    throw new Error('Method not implemented.');
  };
}
