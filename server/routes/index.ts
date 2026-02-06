import { Router } from 'express';

import agreementRoutes from './agreement';
import contactChildArrangementRoutes from './contactChildArrangements';
import domesticAbuseRoutes from './domesticAbuse';
import helpOptions from './helpOptions';
import informationRoutes from './information';
import mediation from './mediation';
import mediationCheck from './mediationCheck';
import optionsNoContact from './optionsNoContact';
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

  // Help options route
  router.use(helpOptions);

  // Mediation check route
  router.use(mediationCheck);

  // Mediation route
  router.use(mediation);

  // Outcome page routes
  router.use(outcomeRoutes);

  // Information page routes
  router.use(informationRoutes);

  return router;
};

export default routes;
