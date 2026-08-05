import path from 'path';

import { Router } from 'express';
import i18n from 'i18n';

import config from '../config';
import { getEnglishPath } from '../constants/paths';

const getPathWithoutLocalePrefix = (url: string): string => {
  const [pathOnly, ...rest] = url.split('?');
  const prefixMatch = pathOnly.match(/^\/(cy|en)(?=\/|$)/);

  if (!prefixMatch) {
    return rest.length > 0 ? `${pathOnly}?${rest.join('?')}` : pathOnly;
  }

  const strippedPath = pathOnly === `/${prefixMatch[1]}` ? '/' : pathOnly.slice(prefixMatch[0].length);

  return rest.length > 0 ? `${strippedPath}?${rest.join('?')}` : strippedPath;
};

const setUpi18n = (): Router => {
  const router = Router();

  const { includeWelshLanguage } = config;

  i18n.configure({
    defaultLocale: 'en',
    locales: includeWelshLanguage ? ['en', 'cy'] : ['en'],
    queryParameter: 'lang',
    cookie: 'lang',
    directory: path.resolve(__dirname, '../locales'),
    updateFiles: false,
    retryInDefaultLocale: true,
    objectNotation: true,
  });

  router.use(i18n.init);

  return router;
};

export const setUpLocaleFromSession = (): Router => {
  const router = Router();

  router.use((req, res, next) => {
    const localeFromPath = req.originalUrl.match(/^\/(cy|en)(?=\/|$)/)?.[1];
    const pathOnly = req.originalUrl.split('?')[0].split('#')[0];
    const localeFromWelshPath = getEnglishPath(pathOnly) !== pathOnly ? 'cy' : undefined;
    const lang = (localeFromPath || localeFromWelshPath || (req.query.lang as string)) as string;

    const localeToUse = lang && i18n.getLocales().includes(lang)
      ? lang
      : req.session?.lang && i18n.getLocales().includes(req.session.lang)
        ? req.session.lang
        : undefined;

    if (localeToUse) {
      req.session.lang = localeToUse;
      req.setLocale(localeToUse);
      res.setLocale(localeToUse);
      i18n.setLocale(localeToUse);
    }

    res.once('finish', () => {
      i18n.setLocale('en');
    });

    res.once('close', () => {
      i18n.setLocale('en');
    });

    if (localeFromPath) {
      req.url = getPathWithoutLocalePrefix(req.url);
    }

    const englishPath = getEnglishPath(pathOnly);
    if (englishPath !== pathOnly) {
      const [, ...rest] = req.url.split('?');
      req.url = rest.length > 0 ? `${englishPath}?${rest.join('?')}` : englishPath;
    }

    if (localeFromPath) {
      req.url = getPathWithoutLocalePrefix(req.url);
    }

    next();
  });

  return router;
};

export default setUpi18n;
