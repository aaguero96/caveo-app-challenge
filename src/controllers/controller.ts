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
import { handleExceptionResponse } from '../utils';
import { UserUnauthorizedException } from '../exceptions';

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
    try {
      const response = await this._service.signInOrRegister(ctx.request.body);

      ctx.status = response.status;
      ctx.body = response;
    } catch (err) {
      handleExceptionResponse(err, ctx);
      return;
    }
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
    ctx: ParameterizedContext<
      DefaultState & { user: UserState },
      DefaultContext,
      GetMeResponseDto
    >,
  ): Promise<void> => {
    try {
      if (!ctx.state.user) {
        throw new UserUnauthorizedException();
      }

      const response = await this._service.getMe(ctx.state.user.id);

      ctx.status = 200;
      ctx.body = response;
    } catch (err) {
      handleExceptionResponse(err, ctx);
      return;
    }
  };

  getUsers = async (
    ctx: ParameterizedContext<
      DefaultState & { user: UserState; query: GetUsersQueryDto },
      DefaultContext,
      GetUsersResponseDto
    >,
  ): Promise<void> => {
    try {
      const response = await this._service.getUsers(ctx.state.query);

      ctx.status = 200;
      ctx.body = response;
    } catch (err) {
      handleExceptionResponse(err, ctx);
      return;
    }
  };
}
