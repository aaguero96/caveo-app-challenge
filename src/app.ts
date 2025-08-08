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

const main = async () => {
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
  const editAccountService = createEditAccountService();
  const getMeService = createGetMeService(userRepository);
  const getUsersService = createGetUsersService();
  const service = createService(
    signInOrRegisterService,
    editAccountService,
    getMeService,
    getUsersService,
  );

  const jwtMiddeware = createJwtMiddleware(auth, userRepository);
  const roleMiddeware = createRoleMiddleware();
  const validateRequestMiddeware = createValidatieRequestMiddleware();

  const controller = createController(service);

  const router = createRouter(
    jwtMiddeware,
    roleMiddeware,
    validateRequestMiddeware,
    controller,
  );

  const app = new Koa();

  app.use(bodyParser());

  app.use(router.routes());

  app.listen(3000);
};

main();
