import { DataSource } from 'typeorm';
import { EditAccountRequestDto, EditAccountResponseDto } from '../../dtos';
import { IEditAccountService } from './edit-account-service.interface';
import { IUserRepository } from '../../repositories/user/user-repository.interface';
import { IAuth } from '../../auth/auth.interface';
import {
  EntityNotFoundException,
  RoleNotAllowedException,
  UserRolePermissionException,
} from '../../exceptions';
import { UserRoleEnum } from '../../enums';
import { UserEntity } from '../../entities';

export const createEditAccountService = (
  dataSource: DataSource,
  userRepository: IUserRepository,
  auth: IAuth,
): IEditAccountService => {
  return new EditAccountService(dataSource, userRepository, auth);
};

class EditAccountService implements IEditAccountService {
  constructor(
    private readonly _dataSource: DataSource,
    private readonly _userRepository: IUserRepository,
    private readonly _auth: IAuth,
  ) {}

  private _validateRole = (ctxUserRole: UserRoleEnum): boolean => {
    const isValid = [UserRoleEnum.USER, UserRoleEnum.ADMIN].includes(
      ctxUserRole,
    );

    return isValid;
  };

  private _validateRequestAsAdmin = (
    ctxUser: UserEntity,
    dto: EditAccountRequestDto,
  ): { isValid: boolean; permissionError?: string | undefined } => {
    if (dto.userId === ctxUser.id && dto.role) {
      return {
        isValid: false,
        permissionError: 'sholdnt update your role',
      };
    }

    return {
      isValid: true,
    };
  };

  private _validateRequestAsUser = (
    ctxUser: UserEntity,
    dto: EditAccountRequestDto,
  ): { isValid: boolean; permissionError?: string | undefined } => {
    if (dto.userId !== ctxUser.id) {
      return {
        isValid: false,
        permissionError: 'sholdnt update others',
      };
    }

    if (dto.role) {
      return {
        isValid: false,
        permissionError: 'sholdnt update role',
      };
    }

    return {
      isValid: true,
    };
  };

  private _validateRequest = (
    ctxUser: UserEntity,
    dto: EditAccountRequestDto,
  ): { isValid: boolean; permissionError?: string | undefined } => {
    switch (ctxUser.role) {
      case UserRoleEnum.ADMIN:
        return this._validateRequestAsAdmin(ctxUser, dto);

      case UserRoleEnum.USER:
        return this._validateRequestAsUser(ctxUser, dto);
    }
  };

  private _updateUserAsAdmin = (
    user: UserEntity,
    dto: EditAccountRequestDto,
  ): void => {
    if (dto.name) {
      user.name = dto.name;
      user.isOnboarded = true;
    }
    if (dto.role) {
      user.role = dto.role;
    }
  };

  private _updateUserAsUser = (
    user: UserEntity,
    dto: EditAccountRequestDto,
  ): void => {
    if (dto.name) {
      user.name = dto.name;
      user.isOnboarded = true;
    }
  };

  private _updateUser = (
    ctxUser: UserEntity,
    user: UserEntity,
    dto: EditAccountRequestDto,
  ): void => {
    switch (ctxUser.role) {
      case UserRoleEnum.ADMIN:
        return this._updateUserAsAdmin(user, dto);

      case UserRoleEnum.USER:
        return this._updateUserAsUser(user, dto);
    }
  };

  editAccount = async (
    ctxUser: UserEntity,
    dto: EditAccountRequestDto,
  ): Promise<EditAccountResponseDto> => {
    const queryRunner = this._dataSource.createQueryRunner();
    const manager = queryRunner.manager;
    await queryRunner.startTransaction();

    try {
      const user = await this._userRepository.findOne({ id: dto.userId! });
      if (!user) {
        throw new EntityNotFoundException({ tableName: 'User' });
      }

      const oldUser = structuredClone(user);

      const isRoleValid = this._validateRole(user.role);
      if (!isRoleValid) {
        throw new RoleNotAllowedException({ userRole: user.role });
      }
      const { isValid: isRequestValid, permissionError } =
        this._validateRequest(ctxUser, dto);
      if (!isRequestValid) {
        throw new UserRolePermissionException({
          role: user.role,
          permissionError: permissionError!,
        });
      }
      this._updateUser(ctxUser, user, dto);

      await this._userRepository.update(user.id, user, { manager });
      if (dto.role) {
        await this._auth.addRoleToUser(user.email, dto.role);
      }

      const newUser = user;

      await queryRunner.commitTransaction();

      return {
        userId: newUser!.id,
        name: newUser!.name,
        role: newUser!.role,
        createdAt: newUser!.createdAt,
        updatedAt: newUser!.updatedAt,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  };
}
