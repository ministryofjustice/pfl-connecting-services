import { Router } from 'express';

import agreementRoutes from './agreement';
import contactChildArrangementRoutes from './contactChildArrangements';
import domesticAbuseRoutes from './domesticAbuse';
import helpToAgreeRoutes from './helpToAgree';
import informationRoutes from './information';
import mediationRoutes from './mediation';
import optionsNoContactRoutes from './optionsNoContact';
import otherOptionsRoutes from './otherOptions';
import outcomeRoutes from './outcomes';
import safeguardingRoutes from './safeguarding';
import startRoutes from './start';

const routes = (): Router => {
  const router = Router();

  // Start page route
  router.use(startRoutes);

  // Domestic abuse question route
  router.use(domesticAbuseRoutes);

  // Agreement on child arrangements route
  router.use(agreementRoutes);

  // Contact child arrangement route
  router.use(contactChildArrangementRoutes);

  // Options no contact
  router.use(optionsNoContactRoutes);

  // Help to agree route
  router.use(helpToAgreeRoutes);

  // Other options check route
  router.use(otherOptionsRoutes);

  // Mediation route
  router.use(mediationRoutes);

  // Safeguarding route (/getting-help)
  router.use(safeguardingRoutes);

  // Outcome page routes
  router.use(outcomeRoutes);

  // Information page routes
  router.use(informationRoutes);

  return router;
};

export default routes;
