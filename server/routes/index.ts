import { Router } from 'express';

import agreementRoutes from './agreement';
import childSafetyRoutes from './childSafety';
import childSafetyHelpRoutes from './childSafetyHelp';
import contactChildArrangementRoutes from './contactChildArrangements';
import CourtOrderRoutes from './courtOrder';
import domesticAbuseRoutes from './domesticAbuse';
import helpToAgreeRoutes from './helpToAgree';
import mediationRoutes from './mediation';
import noContactRoutes from './noContact';
import noContactGuidanceRoutes from './noContactGuidance';
import otherOptionsRoutes from './otherOptions';
import parentingPlanRoutes from './parentingPlan';
import safeguardingRoutes from './safeguarding';
import startRoutes from './start';

const routes = (): Router => {
  const router = Router();

  // Start page route
  router.use(startRoutes);

  // Child safety question route
  router.use(childSafetyRoutes);

  // Child safety help page route
  router.use(childSafetyHelpRoutes);

  // Domestic abuse question route
  router.use(domesticAbuseRoutes);

  // Agreement on child arrangements route
  router.use(agreementRoutes);

  // Contact child arrangement route
  router.use(contactChildArrangementRoutes);

  // No contact
  router.use(noContactRoutes);

  // No contact guidance
  router.use(noContactGuidanceRoutes);

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
