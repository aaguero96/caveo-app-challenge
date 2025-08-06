import Router from 'koa-router';

export const createRouter = (): Router => {
  const router = new Router();

  // post routes
  router.post('/auth');
  router.post('/edit-account');

  // get routes
  router.get('/me');
  router.get('/users');

  return router;
};
