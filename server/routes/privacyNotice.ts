import type { Router } from 'express-serve-static-core';

import config from '../config';
import { getBackUrl } from '../utils/sessionHelpers';
import { registerLocalizedGet } from '../utils/registerLocalizedRoutes';

const privacyNoticeRoutes = (router: Router) => {
  registerLocalizedGet(router, 'PRIVACY_NOTICE', (request, response) => {
    response.render('pages/privacyNotice', {
      title: request.__('privacyNotice.title'),
      backLinkHref: getBackUrl(request.session, config.serviceUrl),
    });
  });
};

export default privacyNoticeRoutes;
