import type { Router } from 'express-serve-static-core';

import config from '../config';
import { getBackUrl } from '../utils/sessionHelpers';
import { registerLocalizedGet } from '../utils/registerLocalizedRoutes';

const termsAndConditionsRoutes = (router: Router) => {
  registerLocalizedGet(router, 'TERMS_AND_CONDITIONS', (request, response) => {
    response.render('pages/termsAndConditions', {
      title: request.__('pages.termsAndConditions.title'),
      backLinkHref: getBackUrl(request.session, config.serviceUrl),
    });
  });
};

export default termsAndConditionsRoutes;
