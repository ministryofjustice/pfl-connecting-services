import type { Router } from 'express-serve-static-core';

import config from '../config';
import { getBackUrl } from '../utils/sessionHelpers';
import { registerLocalizedGet } from '../utils/registerLocalizedRoutes';

const accessibilityStatementRoutes = (router: Router) => {
  registerLocalizedGet(router, 'ACCESSIBILITY_STATEMENT', (request, response) => {
    response.render('pages/accessibilityStatement', {
      title: request.__('pages.accessibilityStatement.title'),
      backLinkHref: getBackUrl(request.session, config.serviceUrl),
    });
  });
};

export default accessibilityStatementRoutes;
