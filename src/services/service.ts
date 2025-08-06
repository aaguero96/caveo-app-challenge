import {
  SignInOrRegisterRequestDto,
  SignInOrRegisterResponseDto,
  EditAccountResponseDto,
  GetMeResponseDto,
  GetUsersQueryDto,
  GetUsersResponseDto,
  EditAccountRequestDto,
} from '../dtos';
import { IEditAccountService } from './edit-account/edit-account-service.interface';
import { IGetMeService } from './get-me/get-me-service.interface';
import { IGetUsersService } from './get-users/get-users.service.interface';
import { IService } from './service.interface';
import { ISignInOrRegisterService } from './sign-in-or-register/sign-in-or-register-service.interface';

export const createService = (
  signInOrRegisterService: ISignInOrRegisterService,
  editAccountService: IEditAccountService,
  getMeService: IGetMeService,
  getUsersService: IGetUsersService,
): IService => {
  return new Service(
    signInOrRegisterService,
    editAccountService,
    getMeService,
    getUsersService,
  );
};

class Service implements IService {
  constructor(
    private readonly _signInOrRegisterService: ISignInOrRegisterService,
    private readonly _editAccountService: IEditAccountService,
    private readonly _getMeService: IGetMeService,
    private readonly _getUsersService: IGetUsersService,
  ) {}

  signInOrRegister = async (
    dto: SignInOrRegisterRequestDto,
  ): Promise<SignInOrRegisterResponseDto> => {
    return this._signInOrRegisterService.signInOrRegister(dto);
  };

  editAccount = async (
    dto: EditAccountRequestDto,
  ): Promise<EditAccountResponseDto> => {
    return this._editAccountService.editAccount(dto);
  };

  getMe = async (userId: string): Promise<GetMeResponseDto> => {
    return this._getMeService.getMe(userId);
  };

  getUsers = async (query: GetUsersQueryDto): Promise<GetUsersResponseDto> => {
    return this._getUsersService.getUsers(query);
  };
}
