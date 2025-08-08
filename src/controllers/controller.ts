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
import { handleExceptionResponse } from '../utils';
import {
  UserRolePermissionException,
  UserUnauthorizedException,
} from '../exceptions';
import { UserRoleEnum } from '../enums';
import { UserEntity } from '../entities';

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
      DefaultState & { user: UserEntity },
      DefaultContext & { request: { body: EditAccountRequestDto } },
      EditAccountResponseDto
    >,
  ): Promise<void> => {
    try {
      const ctxUser = ctx.state.user;

      if (ctxUser.role === UserRoleEnum.USER) {
        if (ctx.request.body.userId) {
          if (ctxUser.id !== ctx.request.body.userId) {
            throw new UserRolePermissionException({
              role: ctxUser.role,
              permissionError: 'shouldnt update others',
            });
          }
        } else {
          ctx.request.body.userId = ctxUser.id;
        }
      } else if (ctxUser.role === UserRoleEnum.ADMIN) {
        if (!ctx.request.body.userId) {
          ctx.request.body.userId = ctxUser.id;
        }
      }

      const response = await this._service.editAccount(
        ctxUser,
        ctx.request.body,
      );

      ctx.status = 200;
      ctx.body = response;
    } catch (err) {
      handleExceptionResponse(err, ctx);
      return;
    }
  };

  getMe = async (
    ctx: ParameterizedContext<
      DefaultState & { user: UserEntity },
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
      DefaultState & { user: UserEntity; query: GetUsersQueryDto },
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
