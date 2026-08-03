import { Router } from 'express';
import type { NextFunction, Request, Response } from 'express';

import config from '../config';
import paths from '../constants/paths';
import welshPaths from '../constants/welshPaths';
import logger from '../logging/logger';
import { hasUserStartedJourney } from '../utils/formProgressHelpers';
import { getLocalizedPath, getPathKey } from '../utils/localizedPaths';
import sendSessionTimeoutResponse from '../utils/sendSessionTimeoutResponse';

const EXEMPT_PATH_PREFIXES = ['/assets', '/api/'];
const EXEMPT_PATHS = new Set<string>([
  paths.SESSION_TIMED_OUT,
  welshPaths.SESSION_TIMED_OUT,
  '/health',
  '/create-timeout',
  '/create-error',
]);

const ALWAYS_ALLOWED_PATH_KEYS = new Set(['START', 'CHILD_SAFETY', 'PASSWORD']);
const STATIC_PAGE_PATH_KEYS = new Set([
  'ACCESSIBILITY_STATEMENT',
  'CONTACT_US',
  'COOKIES',
  'PRIVACY_NOTICE',
  'TERMS_AND_CONDITIONS',
]);

const isExemptPath = (path: string): boolean =>
  EXEMPT_PATH_PREFIXES.some((prefix) => path.startsWith(prefix)) || EXEMPT_PATHS.has(path);

const isStaticPage = (path: string): boolean => {
  const pathKey = getPathKey(path);
  return pathKey ? STATIC_PAGE_PATH_KEYS.has(pathKey) : false;
};

const isAlwaysAllowedPath = (path: string): boolean => {
  const pathKey = getPathKey(path);
  return pathKey ? ALWAYS_ALLOWED_PATH_KEYS.has(pathKey) : false;
};

const isSessionProtectedPath = (path: string): boolean =>
  !isExemptPath(path) && !isAlwaysAllowedPath(path) && !isStaticPage(path);

export const checkSessionTimeout = (request: Request, response: Response, next: NextFunction): void => {
  const path = request.path;
  const completedSteps: string[] = request.session?.completedSteps || [];
  const pageHistory: string[] = request.session?.pageHistory || [];
  const journeyStarted = hasUserStartedJourney(completedSteps, pageHistory);

  if (journeyStarted && getPathKey(path) !== 'SESSION_TIMED_OUT') {
    const locale = typeof response.getLocale === 'function' ? response.getLocale() : 'en';
    response.locals.sessionTimeoutMs = config.session.expiryMinutes * 60 * 1000;
    response.locals.sessionTimeoutSeconds = config.session.expiryMinutes * 60;
    response.locals.sessionTimeoutPath = getLocalizedPath('SESSION_TIMED_OUT', locale);
  }

  if (
    journeyStarted &&
    request.session.cookie?.expires &&
    new Date() > new Date(request.session.cookie.expires)
  ) {
    logger.info('Session timed out for ' + request.originalUrl);
    request.session.destroy((error) => {
      if (error) {
        logger.error('Error destroying session after timeout', error);
      }
      sendSessionTimeoutResponse(request, response);
    });
    return;
  }

  if (
    isSessionProtectedPath(path) &&
    !journeyStarted &&
    (request.method === 'GET' || request.method === 'POST')
  ) {
    logger.info('Session timed out for ' + request.originalUrl);
    sendSessionTimeoutResponse(request, response);
    return;
  }

  next();
};

const setupSessionTimeout = (): Router => {
  const router = Router();
  router.use(checkSessionTimeout);
  return router;
};

export default setupSessionTimeout;
