import { ParameterizedContext, DefaultContext, DefaultState } from 'koa';
import { IController } from './controller.interface';
import { IService } from '../services/service.interface';
import {
  EditAccountRequestDto,
  EditAccountResponseDto,
  GetMeResponseDto,
  GetUsersQueryDto,
  GetUsersResponseDto,
  SignInOrRegisterRequestDto,
  SignInOrRegisterResponseDto,
} from '../dtos';
import { UserState } from '../states/user.state';

export const createController = (service: IService): IController => {
  return new Controller(service);
};

class Controller implements IController {
  constructor(private readonly _service: IService) {}

  signInOrRegister = async (
    ctx: ParameterizedContext<
      DefaultState,
      DefaultContext & { request: { body: SignInOrRegisterRequestDto } },
      SignInOrRegisterResponseDto
    >,
  ): Promise<void> => {
    ctx.status = 201;
    ctx.body = await this._service.signInOrRegister(ctx.request.body);
  };

  editAccount = async (
    ctx: ParameterizedContext<
      UserState,
      DefaultContext & { request: { body: EditAccountRequestDto } },
      EditAccountResponseDto
    >,
  ): Promise<void> => {
    ctx.status = 200;
    ctx.body = await this._service.editAccount(ctx.request.body);
  };

  getMe = async (
    ctx: ParameterizedContext<UserState, DefaultContext, GetMeResponseDto>,
  ): Promise<void> => {
    ctx.status = 200;
    ctx.body = await this._service.getMe(ctx.state.id);
  };

  getUsers = async (
    ctx: ParameterizedContext<
      UserState,
      DefaultContext & { query: GetUsersQueryDto },
      GetUsersResponseDto
    >,
  ): Promise<void> => {
    ctx.status = 200;
    ctx.body = await this._service.getUsers(ctx.query);
  };
}
