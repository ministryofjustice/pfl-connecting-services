import { Router } from 'express';

import agreementRoutes from './agreement';
import contactChildArrangementRoutes from './contactChildArrangements';
import CourtOrderRoutes from './courtOrder';
import domesticAbuseRoutes from './domesticAbuse';
import helpToAgreeRoutes from './helpToAgree';
import mediationRoutes from './mediation';
import optionsNoContactRoutes from './optionsNoContact';
import otherOptionsRoutes from './otherOptions';
import parentingPlanRoutes from './parentingPlan';
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

  // Court order route
  router.use(CourtOrderRoutes);

  // Parenting plan route
  router.use(parentingPlanRoutes);

  return router;
};

export default routes;
