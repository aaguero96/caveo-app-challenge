import Koa from 'koa';
import { createRouter } from './router/router';

const main = async () => {
  const router = createRouter();

  const app = new Koa();

  app.use(router.routes());

  app.listen(3000);
};

main();
