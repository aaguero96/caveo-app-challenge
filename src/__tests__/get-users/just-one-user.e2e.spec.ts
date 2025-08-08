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

describe('GET /users', () => {
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

  it('get users by admin - no query parameters', async () => {
    // prepare database
    const user = await createEntity(UserEntity, dataSource.manager, {
      email: 'test@test.com',
      role: UserRoleEnum.ADMIN,
    });

    // instance mocks
    const mockAuthDecodeToken = auth.decodeToken as jest.Mock;

    // resolve mooks
    mockAuthDecodeToken.mockResolvedValue({
      email: 'test@test.com',
      role: [UserRoleEnum.ADMIN],
    });

    // call endpoint
    const response = await request(app.callback())
      .get('/api/users')
      .set({ authorization: 'Bearer mocked-token' });

    // expect mock
    expect(mockAuthDecodeToken).toHaveBeenCalledWith('mocked-token');

    // expect response
    expect(response.statusCode).toEqual(200);

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
