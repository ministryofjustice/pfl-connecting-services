import { SessionData } from 'express-session';

import { validateRedirectUrl } from './redirectValidator';

export const getBackUrl = (session: Partial<SessionData>, defaultUrl: string) => {
  console.log('SESSION DATA:', session);
  console.log('Previous page in session:', session.previousPage);
  console.log('Default URL:', defaultUrl);
  if (!session.previousPage) {
    return defaultUrl;
  }
  return validateRedirectUrl(session.previousPage, defaultUrl);
};

export const getRedirectUrlAfterFormSubmit = (session: Partial<SessionData>, defaultUrl: string) => {
  // defaultUrl is already from paths enum, so it's safe
  return defaultUrl;
};
