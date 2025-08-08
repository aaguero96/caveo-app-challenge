import Koa from 'koa';
import { createApp } from '../../app';
import { createDatabaseConfig, EnvConfig, DatabaseConfig } from '../../config';
import { UserRoleEnum } from '../../enums';
import { IAuth } from '../../auth/auth.interface';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { UserEntity } from '../../entities';
import { createEnvsForTest } from '../utils';

const envs = createEnvsForTest();

const mockAuth = {
  addRoleToUser: jest.fn(),
  decodeToken: jest.fn(),
  signIn: jest.fn(),
  confirmUser: jest.fn(),
  signUp: jest.fn(),
};

jest.mock('../../config/env.config', () => {
  return {
    createEnvConfig: (): EnvConfig => {
      return envs;
    },
  };
});
jest.mock('../../auth/auth', () => {
  return {
    createAuth: (): IAuth => {
      return mockAuth;
    },
  };
});

import { createAuth } from '../../auth/auth';

describe('POST /auth', () => {
  let databaseConfig: DatabaseConfig;
  let dataSource: DataSource;
  let auth: IAuth;
  let app: Koa;

  beforeEach(async () => {
    auth = createAuth(envs);
    databaseConfig = createDatabaseConfig(envs);
    dataSource = databaseConfig.dataSource;
    app = await createApp();

    await dataSource.initialize();
  });

  afterEach(async () => {
    await dataSource.manager.deleteAll(UserEntity);
    await dataSource.destroy();
    jest.clearAllMocks();
  });

  it('register user when its not regitered yet', async () => {
    // instance mocks
    const mockAuthSignUp = auth.signUp as jest.Mock;
    const mockAuthConfirmUser = auth.confirmUser as jest.Mock;
    const mockAuthAddRoleToUser = auth.addRoleToUser as jest.Mock;
    const mockAuthSignIn = auth.signIn as jest.Mock;

    // resolve mooks
    mockAuthSignUp.mockResolvedValueOnce(undefined);
    mockAuthConfirmUser.mockResolvedValueOnce(undefined);
    mockAuthAddRoleToUser.mockResolvedValueOnce(undefined);
    mockAuthSignIn.mockResolvedValue({
      token: 'mocked-token',
      expiresIn: '3600s',
    });

    // request body
    const requestBody = {
      email: 'test@test.com',
      password: '123abcABC!@#',
    };

    // call endpoint
    const response = await request(app.callback())
      .post('/api/auth')
      .send(requestBody);

    // expect mock
    expect(mockAuthSignUp).toHaveBeenCalledWith(
      'test@test.com',
      '123abcABC!@#',
    );
    expect(mockAuthConfirmUser).toHaveBeenCalledWith('test@test.com');
    expect(mockAuthAddRoleToUser).toHaveBeenCalledWith(
      'test@test.com',
      UserRoleEnum.USER,
    );
    expect(mockAuthSignIn).toHaveBeenCalledWith(
      'test@test.com',
      '123abcABC!@#',
    );

    // expect response
    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        type: 'Bearer',
        token: 'mocked-token',
        expiresIn: '3600s',
      }),
    );

    // expect database
    expect(
      dataSource.manager.findOne(UserEntity, {
        where: { email: 'test@test.com' },
      }),
    ).resolves.toEqual(
      expect.objectContaining({
        id: expect.any(String),
        email: 'test@test.com',
        name: null,
        role: 'usuário',
        isOnboarded: false,
        createdAt: expect.any(Date),
        deletedAt: null,
        updatedAt: null,
      }),
    );
  });
});
