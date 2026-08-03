import paths from './paths';

const welshPaths: Record<keyof typeof paths, string> = {
  PASSWORD: '/cyfrinair',
  START: '/',
  ACCESSIBILITY_STATEMENT: '/hygyrchedd',
  CONTACT_US: '/cysylltu-a-ni',
  COOKIES: '/cwcis',
  PRIVACY_NOTICE: '/hysbysiad-preifatrwydd',
  TERMS_AND_CONDITIONS: '/telerau-ac-amodau',
  CHILD_SAFETY: '/diogelwch-plant',
  CHILD_SAFETY_HELP: '/cymorth-diogelwch-plant',
  DOMESTIC_ABUSE: '/cam-drin-domestig',
  SAFEGUARDING: '/cael-cymorth',
  CONTACT_CHILD_ARRANGEMENTS: '/cysylltu-trefniant-plant',
  OPTIONS_NO_CONTACT: '/opsiynau-dim-cyswllt',
  AGREEMENT: '/cytuno',
  HELP_TO_AGREE: '/help-i-gytuno',
  OTHER_OPTIONS: '/opsiynau-eraill',
  COURT_ORDER: '/gorchymyn-llys',
  MEDIATION: '/cyfryngu',
  PARENTING_PLAN: '/cynllun-rhianta',
  SESSION_TIMED_OUT: '/sesiwn-wedi-amseru-allan',
};

export default welshPaths;
