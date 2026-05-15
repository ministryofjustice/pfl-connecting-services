import type { Router } from 'express-serve-static-core';

import config from '../config';
import paths from '../constants/paths';
import { getBackUrl } from '../utils/sessionHelpers';

const accessibilityStatementRoutes = (router: Router) => {
  router.get(paths.ACCESSIBILITY_STATEMENT, (request, response) => {
    response.render('pages/accessibilityStatement', {
      title: request.__('pages.accessibilityStatement.title'),
      backLinkHref: getBackUrl(request.session, config.serviceUrl),
    });
  });
};

export default accessibilityStatementRoutes;
