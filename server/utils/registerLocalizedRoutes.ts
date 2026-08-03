import { RequestHandler, Router } from 'express';
import type { Response } from 'express';

import config from '../config';
import paths from '../constants/paths';
import { getLocalizedPath, PathKey } from './localizedPaths';

export const registerLocalizedGet = (
  router: Router,
  pathKey: PathKey,
  ...handlers: RequestHandler[]
): void => {
  router.get(paths[pathKey], ...handlers);

  if (config.includeWelshLanguage) {
    router.get(getLocalizedPath(pathKey, 'cy'), ...handlers);
  }
};

export const registerLocalizedPost = (
  router: Router,
  pathKey: PathKey,
  ...handlers: RequestHandler[]
): void => {
  router.post(paths[pathKey], ...handlers);

  if (config.includeWelshLanguage) {
    router.post(getLocalizedPath(pathKey, 'cy'), ...handlers);
  }
};

export const redirectToPath = (response: Response, pathKey: PathKey) =>
  response.redirect(getLocalizedPath(pathKey, response.getLocale()));
