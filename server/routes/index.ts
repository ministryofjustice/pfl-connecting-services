import { Router } from 'express';

import informationRoutes from './information';
import outcomeRoutes from './outcomes';
import questionRoutes from './questions';
import startRoutes from './start';

const routes = (): Router => {
  const router = Router();

  // Start page route
  router.use(startRoutes);

  // Question flow routes
  router.use(questionRoutes);

  // Outcome page routes
  router.use(outcomeRoutes);

  // Information page routes
  router.use(informationRoutes);

  return router;
};

export default routes;
