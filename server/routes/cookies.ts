import type { Router } from 'express-serve-static-core';

import { yesOrNo } from '../@types/fields';
import config from '../config';
import cookieNames from '../constants/cookieNames';
import { ACCEPT_OPTIONAL_COOKIES } from '../constants/formFields';
import paths from '../constants/paths';
import logger from '../logging/logger';
import { redirectToPath, registerLocalizedGet, registerLocalizedPost } from '../utils/registerLocalizedRoutes';
import { getBackUrl } from '../utils/sessionHelpers';

const cookiesRoutes = (router: Router) => {
  registerLocalizedGet(router, 'COOKIES', (request, response) => {
    response.render('pages/cookies', {
      title: request.__('pages.cookies.title'),
      backLinkHref: getBackUrl(request.session, config.serviceUrl),
    });
  });

  registerLocalizedPost(router, 'COOKIES', (request, response) => {
    logger.info(`Accepted analytics. POST ${paths.COOKIES}`);
    const acceptAnalytics = request.body[ACCEPT_OPTIONAL_COOKIES] as yesOrNo;

    response.cookie(cookieNames.ANALYTICS_CONSENT, JSON.stringify({ acceptAnalytics }), {
      maxAge: 1000 * 60 * 60 * 24 * 365, // One Year
      secure: config.useHttps,
      httpOnly: false,
      sameSite: 'lax',
    });

    if (acceptAnalytics === 'No') {
      const domain = request.hostname;

      response.clearCookie('_ga', { domain, secure: false, httpOnly: false });
      response.clearCookie(`_ga_${config.analytics.ga4Id.replace('G-', '')}`, {
        domain,
        secure: false,
        httpOnly: false,
      });
    }

    return redirectToPath(response, 'COOKIES');
  });
};

export default cookiesRoutes;
