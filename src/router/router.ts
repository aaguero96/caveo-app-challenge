import Router from 'koa-router';
import { IController } from '../controllers/controller.interface';

export const createRouter = (controller: IController): Router => {
  const router = new Router();
  router.prefix('/api');

  // post routes
  router.post('/auth', controller.signInOrRegister);
  router.post('/edit-account', controller.editAccount);

  // get routes
  router.get('/me', controller.getMe);
  router.get('/users', controller.getUsers);

  return router;
};
