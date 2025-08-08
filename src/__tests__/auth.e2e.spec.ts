import Koa from 'koa';
import { createApp } from '../app';
import { createDatabaseConfig, EnvConfig, DatabaseConfig } from '../config';
import { EnvironmentEnum, UserRoleEnum } from '../enums';
import { IAuth } from '../auth/auth.interface';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { createAuth } from '../auth/auth';
import { UserEntity } from '../entities';

const envs = {
  api: {
    nodeEnv: EnvironmentEnum.TEST,
    port: 3000,
  },
  database: {
    host: 'localhost',
    name: 'test',
    password: 'test',
    port: 5432,
    username: 'test',
    ssl: false,
  },
  aws: {
    accessKeyId: '',
    secretAccessKey: '',
    cognito: {
      region: '',
      clientId: '',
      clientSecret: '',
      tokenSigningKeyUrl: '',
      userPoolId: '',
    },
  },
};

const auth = {
  addRoleToUser: jest.fn(),
  decodeToken: jest.fn(),
  signIn: jest.fn(),
  confirmUser: jest.fn(),
  signUp: jest.fn(),
};

jest.mock('../config/env.config', () => {
  return {
    createEnvConfig: (): EnvConfig => {
      return envs;
    },
  };
});
jest.mock('../auth/auth', () => {
  return {
    createAuth: (): IAuth => {
      return auth;
    },
  };
});

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
  });

  it('create user when its not regitered yet', async () => {
    // prepare database
    // const user = await dataSource.manager.create(UserEntity, {});

    // instance mocks
    const mockAuthSignUp = auth.signUp as jest.Mock;
    const mockAuthConfirmUser = auth.confirmUser as jest.Mock;
    const mockAuthAddRoleToUser = auth.addRoleToUser as jest.Mock;
    const mockAuthAddSignIn = auth.signIn as jest.Mock;

    // resolve mooks
    mockAuthSignUp.mockResolvedValueOnce(undefined);
    mockAuthConfirmUser.mockResolvedValueOnce(undefined);
    mockAuthAddRoleToUser.mockResolvedValueOnce(undefined);
    mockAuthAddSignIn.mockResolvedValueOnce({
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
    expect(mockAuthAddSignIn).toHaveBeenCalledWith(
      'test@test.com',
      '123abcABC!@#',
    );

    // expect response
    expect(response.statusCode).toEqual(201);

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
