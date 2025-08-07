import Router from 'koa-router';
import { IController } from '../controllers/controller.interface';
import { IJwtMiddleware } from '../middlewares/jwt/jwt-middleware.interface';
import { IRoleMiddleware } from '../middlewares/role/role-middleware.interface';
import { UserRoleEnum } from '../enums';
import { IValidateRequestMiddleware } from '../middlewares/validate-request/validate-request-middleware.interface';
import { signInOrRegisterRequestSchema } from '../dtos';

export const createRouter = (
  jwtMiddleware: IJwtMiddleware,
  roleMiddleware: IRoleMiddleware,
  validateRequestMiddleware: IValidateRequestMiddleware,
  controller: IController,
): Router => {
  const router = new Router();
  router.prefix('/api');

  // // public routes

  // post routes
  router.post(
    '/auth',
    validateRequestMiddleware.validateRequest(signInOrRegisterRequestSchema),
    controller.signInOrRegister,
  );

  // // private routes (bearer token)
  router.use(jwtMiddleware.validateBearerToken);

  // post routes
  router.post(
    '/edit-account',
    roleMiddleware.validateUserRole([UserRoleEnum.USER, UserRoleEnum.ADMIN]),
    controller.editAccount,
  );

  // get routes
  router.get('/me', controller.getMe);
  router.get(
    '/users',
    roleMiddleware.validateUserRole([UserRoleEnum.ADMIN]),
    controller.getUsers,
  );

  return router;
};
