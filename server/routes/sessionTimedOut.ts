import type { Router } from 'express-serve-static-core';

import logger from '../logging/logger';
import { registerLocalizedGet } from '../utils/registerLocalizedRoutes';
import sendSessionTimeoutResponse from '../utils/sendSessionTimeoutResponse';

const sessionTimedOutRoutes = (router: Router) => {
  registerLocalizedGet(router, 'SESSION_TIMED_OUT', (request, response) => {
    if (!request.session) {
      return sendSessionTimeoutResponse(request, response);
    }

    request.session.destroy((error) => {
      if (error) {
        logger.error('Error destroying session after timeout', error);
      }

      sendSessionTimeoutResponse(request, response);
    });
  });
};

export default sessionTimedOutRoutes;
