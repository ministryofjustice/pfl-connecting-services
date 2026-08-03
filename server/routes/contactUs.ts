import type { Router } from 'express-serve-static-core';

import config from '../config';
import { getBackUrl } from '../utils/sessionHelpers';
import { registerLocalizedGet } from '../utils/registerLocalizedRoutes';

const contactUsRoutes = (router: Router) => {
  registerLocalizedGet(router, 'CONTACT_US', (request, response) => {
    response.render('pages/contactUs', {
      title: request.__('contactUs.title'),
      backLinkHref: getBackUrl(request.session, config.serviceUrl),
    });
  });
};

export default contactUsRoutes;
