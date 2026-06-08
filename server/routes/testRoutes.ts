import { Router } from 'express';
import createError from 'http-errors';

const testRoutes = (): Router => {
  const router = Router();

  router.get('/create-timeout', (_request, _response, next) => {
    next(createError(403));
  });

  return router;
};

export default testRoutes;
