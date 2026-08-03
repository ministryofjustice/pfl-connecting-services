import { Router } from 'express';

import { getLocalizedPaths, localizePath } from '../utils/localizedPaths';

const setLocalizedPaths = (): Router => {
  const router = Router();

  router.use((request, response, next) => {
    const locale = response.getLocale();
    response.locals.paths = getLocalizedPaths(locale);
    response.locals.alternateLanguagePath = (path = request.path) => {
      const alternateLocale = locale === 'cy' ? 'en' : 'cy';
      const localizedPath = localizePath(path, alternateLocale);

      if (localizedPath === path && locale !== 'cy' && alternateLocale === 'cy') {
        return `${path}?lang=cy`;
      }

      if (localizedPath === path && locale === 'cy' && alternateLocale === 'en') {
        return `${path}?lang=en`;
      }

      return localizedPath;
    };
    next();
  });

  return router;
};

export default setLocalizedPaths;
