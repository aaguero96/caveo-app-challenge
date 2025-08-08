import Koa from 'koa';
import { createRouter } from './router/router';
import { createController } from './controllers/controller';
import { createService } from './services/service';
import { createSignInOrRegosterService } from './services/sign-in-or-register/sign-in-or-register.service';
import { createEditAccountService } from './services/edit-account/edit-account.service';
import { createGetMeService } from './services/get-me/get-me.service';
import { createGetUsersService } from './services/get-users/get-users.service';
import bodyParser from 'koa-bodyparser';
import { createJwtMiddleware } from './middlewares/jwt/jwt.middleware';
import { createRoleMiddleware } from './middlewares/role/role.middleware';
import { createDatabaseConfig, createEnvConfig } from './config';
import { createAuth } from './auth/auth';
import { createUserRepository } from './repositories/user/user.repository';
import { createValidatieRequestMiddleware } from './middlewares/validate-request/validate-request.middleware';
import { createValidatieQueryMiddleware } from './middlewares/validate-query/validate-query.middleware';
import { SwaggerRouter } from 'koa-swagger-decorator';
import {
  AuthSwagger,
  EditAccountSwagger,
  GetMeSwagger,
  GetUsersSwagger,
} from './swagger';

export const createApp = async (): Promise<Koa> => {
  const envConfig = createEnvConfig();
  const databaseConfig = createDatabaseConfig(envConfig);
  await databaseConfig.dataSource.initialize();
  await databaseConfig.dataSource.runMigrations();

  const auth = createAuth(envConfig);
  const userRepository = createUserRepository(databaseConfig.dataSource);

  const signInOrRegisterService = createSignInOrRegosterService(
    databaseConfig.dataSource,
    auth,
    userRepository,
  );
  const editAccountService = createEditAccountService(
    databaseConfig.dataSource,
    userRepository,
    auth,
  );
  const getMeService = createGetMeService(userRepository);
  const getUsersService = createGetUsersService(userRepository);
  const service = createService(
    signInOrRegisterService,
    editAccountService,
    getMeService,
    getUsersService,
  );

  const jwtMiddeware = createJwtMiddleware(auth, userRepository);
  const roleMiddeware = createRoleMiddleware();
  const validateRequestMiddeware = createValidatieRequestMiddleware();
  const validateQueryMiddeware = createValidatieQueryMiddleware();

  const controller = createController(service);

  const router = createRouter(
    jwtMiddeware,
    roleMiddeware,
    validateRequestMiddeware,
    validateQueryMiddeware,
    controller,
  );

  const app = new Koa();

  const swaggerRouter = new SwaggerRouter();
  swaggerRouter.swagger({
    title: 'CAVEO API CHALLENGE',
    description: 'API documentation',
    version: '1.0.0',
    swaggerHtmlEndpoint: '/docs',
    swaggerJsonEndpoint: '/docs-json',
    swaggerOptions: {
      securityDefinitions: {
        access_token: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
        },
      },
    },
  });
  swaggerRouter.map(AuthSwagger, {});
  swaggerRouter.map(GetMeSwagger, {});
  swaggerRouter.map(EditAccountSwagger, {});
  swaggerRouter.map(GetUsersSwagger, {});

  app.use(bodyParser());

  app.use(router.routes());

  app.use(swaggerRouter.routes());

  return app;
};
