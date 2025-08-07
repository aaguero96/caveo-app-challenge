import { DataSource } from 'typeorm';
import { IAuth } from '../../auth/auth.interface';
import {
  SignInOrRegisterRequestDto,
  SignInOrRegisterResponseDto,
} from '../../dtos';
import { UserRoleEnum } from '../../enums';
import { IUserRepository } from '../../repositories/user/user-repository.interface';
import { ISignInOrRegisterService } from './sign-in-or-register-service.interface';

export const createSignInOrRegosterService = (
  dataSource: DataSource,
  auth: IAuth,
  userRepository: IUserRepository,
): ISignInOrRegisterService => {
  return new SignInOrRegisterService(dataSource, auth, userRepository);
};

class SignInOrRegisterService implements ISignInOrRegisterService {
  constructor(
    private readonly _dataSource: DataSource,
    private readonly _auth: IAuth,
    private readonly _userRepository: IUserRepository,
  ) {}

  signInOrRegister = async (
    dto: SignInOrRegisterRequestDto,
  ): Promise<SignInOrRegisterResponseDto> => {
    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    const manager = queryRunner.manager;

    let statusCodeResponse = 200;
    try {
      const user = await this._userRepository.findOne({ email: dto.email });
      if (!user) {
        await this._userRepository.create(
          {
            email: dto.email,
            role: UserRoleEnum.USER,
          },
          { manager },
        );

        await this._auth.signUp(dto.email, dto.password);

        await this._auth.confirmUser(dto.email);

        await this._auth.addRoleToUser(dto.email, UserRoleEnum.USER);

        statusCodeResponse = 201;
      }

      const { token, expiresIn } = await this._auth.signIn(
        dto.email,
        dto.password,
      );

      await queryRunner.commitTransaction();

      return {
        type: 'Bearer',
        token,
        expiresIn,
        status: statusCodeResponse,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  };
}
