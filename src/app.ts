import Koa from 'koa';
import { createRouter } from './router/router';
import { createController } from './controllers/controller';

const main = async () => {
  const controller = createController();

  const router = createRouter(controller);

  const app = new Koa();

  app.use(router.routes());

  app.listen(3000);
};

main();
