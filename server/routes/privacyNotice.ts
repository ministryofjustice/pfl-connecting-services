import type { Router } from 'express-serve-static-core';

import config from '../config';
import paths from '../constants/paths';
import { getBackUrl } from '../utils/sessionHelpers';

const privacyNoticeRoutes = (router: Router) => {
  router.get(paths.PRIVACY_NOTICE, (request, response) => {
    response.render('pages/privacyNotice', {
      title: request.__('privacyNotice.title'),
      backLinkHref: getBackUrl(request.session, config.serviceUrl),
    });
  });
};

export default privacyNoticeRoutes;
