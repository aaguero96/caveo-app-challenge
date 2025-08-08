import Koa from 'koa';
import { createApp } from '../../app';
import { createDatabaseConfig, EnvConfig, DatabaseConfig } from '../../config';
import { UserRoleEnum } from '../../enums';
import { IAuth } from '../../auth/auth.interface';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { UserEntity } from '../../entities';
import { createEntity, createEnvsForTest } from '../utils';

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

  it('signin user if it alrteady been created', async () => {
    // prepare database
    const user = await createEntity(UserEntity, dataSource.manager, {
      email: 'test@test.com',
      role: UserRoleEnum.USER,
    });

    // instance mocks
    const mockAuthSignIn = auth.signIn as jest.Mock;

    // resolve mooks
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
    expect(mockAuthSignIn).toHaveBeenCalledWith(
      'test@test.com',
      '123abcABC!@#',
    );

    // expect response
    expect(response.statusCode).toEqual(200);
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
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isOnboarded: user.isOnboarded,
        createdAt: user.createdAt,
        deletedAt: user.deletedAt,
        updatedAt: user.updatedAt,
      }),
    );
  });
});
