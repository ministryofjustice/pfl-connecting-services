import i18n from 'i18n';

import config from '../config';

const basePaths = {
  // Auth & static pages
  PASSWORD: '/password',
  START: '/',
  ACCESSIBILITY_STATEMENT: '/accessibility',
  CONTACT_US: '/contact-us',
  COOKIES: '/cookies',
  PRIVACY_NOTICE: '/privacy-notice',
  TERMS_AND_CONDITIONS: '/terms-conditions',

  // Connecting Services specific paths
  CHILD_SAFETY: '/child-safety',
  CHILD_SAFETY_HELP: '/child-safety-help',
  DOMESTIC_ABUSE: '/domestic-abuse',
  SAFEGUARDING: '/getting-help',
  CONTACT_CHILD_ARRANGEMENTS: '/contact-child-arrangements',
  OPTIONS_NO_CONTACT: '/options-no-contact',
  AGREEMENT: '/agree',
  HELP_TO_AGREE: '/help-to-agree',
  OTHER_OPTIONS: '/other-options',

  // Outcome pages
  COURT_ORDER: '/court-order',
  MEDIATION: '/mediation',
  PARENTING_PLAN: '/parenting-plan',

  SESSION_TIMED_OUT: '/session-timed-out',
} as const;

const welshPathTranslations: Record<string, string> = {
  '/': '/',
  '/accessibility': '/hygyrchedd',
  '/contact-us': '/cysylltu-a-ni',
  '/cookies': '/cwcis',
  '/privacy-notice': '/hysbysiad-preifatrwydd',
  '/terms-conditions': '/telerau-ac-amodau',
  '/child-safety': '/diogelwch-plant',
  '/child-safety-help': '/cymorth-diogelwch-plant',
  '/domestic-abuse': '/cam-drin-domestig',
  '/getting-help': '/cael-cymorth',
  '/contact-child-arrangements': '/cysylltu-trefniant-plant',
  '/options-no-contact': '/opsiynau-dim-cyswllt',
  '/agree': '/cytuno',
  '/help-to-agree': '/help-i-gytuno',
  '/other-options': '/opsiynau-eraill',
  '/court-order': '/gorchymyn-llys',
  '/mediation': '/cyfryngu',
  '/parenting-plan': '/cynllun-rhianta',
  '/session-timed-out': '/session-wedi-cyrraedd-terfyn',
  '/password': '/password',
};

export const getPathForLocale = (path: string, locale = i18n.getLocale()): string => {
  try {
    if (!config.includeWelshLanguage || locale !== 'cy') {
      return path;
    }

    return welshPathTranslations[path] || path;
  } catch {
    return path;
  }
};

export const getEnglishPath = (path: string): string => {
  const englishPath = Object.entries(welshPathTranslations).find(([, translatedPath]) => translatedPath === path)?.[0];
  return englishPath || path;
};

const paths = new Proxy(basePaths, {
  get(target, property: string | symbol) {
    const value = Reflect.get(target, property);

    if (typeof value === 'string') {
      return getPathForLocale(value);
    }

    return value;
  },
});

export default paths;
