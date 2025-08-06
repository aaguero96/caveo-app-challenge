import Koa from 'koa';
import { createRouter } from './router/router';
import { createController } from './controllers/controller';
import { createService } from './services/service';
import { createSignInOrRegosterService } from './services/sign-in-or-register/sign-in-or-register.service';
import { createEditAccountService } from './services/edit-account/edit-account.service';
import { createGetMeService } from './services/get-me/get-me.service';
import { createGetUsersService } from './services/get-users/get-users.service';
import bodyParser from 'koa-bodyparser';

const main = async () => {
  const signInOrRegisterService = createSignInOrRegosterService();
  const editAccountService = createEditAccountService();
  const getMeService = createGetMeService();
  const getUsersService = createGetUsersService();
  const service = createService(
    signInOrRegisterService,
    editAccountService,
    getMeService,
    getUsersService,
  );

  const controller = createController(service);

  const router = createRouter(controller);

  const app = new Koa();

  app.use(bodyParser());

  app.use(router.routes());

  app.listen(3000);
};

main();
