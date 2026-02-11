import { Router } from 'express';

import agreementRoutes from './agreement';
import contactChildArrangementRoutes from './contactChildArrangements';
import domesticAbuseRoutes from './domesticAbuse';
import helpToAgree from './helpToAgree';
import informationRoutes from './information';
import mediation from './mediation';
import optionsNoContact from './optionsNoContact';
import otherOptions from './otherOptions';
import outcomeRoutes from './outcomes';
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
  router.use(optionsNoContact);

  // Help to agree route
  router.use(helpToAgree);

  // Other options check route
  router.use(otherOptions);

  // Mediation route
  router.use(mediation);

  // Outcome page routes
  router.use(outcomeRoutes);

  // Information page routes
  router.use(informationRoutes);

  return router;
};

export default routes;
