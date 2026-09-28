import { RequestHandler } from 'express';

import config from '../config';
import cookieNames from '../constants/cookieNames';

export default function setupAnalytics(): RequestHandler {
  return (request, response, next) => {
    // Recording (GA4 and OpenSearch) is environment-gated. Cookie banner and
    // cookie policy still follow consent so lower environments match Live.
    response.locals.analyticsEnvironmentEnabled = config.analytics.enabled;
    response.locals.ga4Id = config.analytics.ga4Id;
    try {
      const cookiePolicy = JSON.parse(decodeURIComponent(request.cookies[cookieNames.ANALYTICS_CONSENT]));
      if (cookiePolicy?.acceptAnalytics !== undefined) {
        response.locals.analyticsEnabled = cookiePolicy.acceptAnalytics === 'Yes';
      }
    } catch {
      /* empty - cookie policy is undefined */
    }

    return next();
  };
}
