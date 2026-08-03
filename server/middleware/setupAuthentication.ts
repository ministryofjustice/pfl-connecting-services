import url from 'url';

import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express-serve-static-core';

import config from '../config';
import cookieNames from '../constants/cookieNames';
import { getLocalizedPath } from '../utils/localizedPaths';
import encryptPassword from '../utils/encryptPassword';

const setupAuthentication = () => {
  const router = Router();

  router.use((req: Request, res: Response, next: NextFunction) => {
    if (!config.useAuth || isAuthenticated(req)) {
      next();
      return;
    }
    sendUserToPasswordPage(req, res);
  });
  return router;
};

const sendUserToPasswordPage = (req: Request, res: Response) => {
  const passwordPageURL = url.format({
    pathname: getLocalizedPath('PASSWORD', res.getLocale()),
    query: { returnURL: req.originalUrl },
  });
  res.redirect(passwordPageURL);
};

const isAuthenticated = (req: Request) =>
  config.passwords.map(encryptPassword).some((p) => p === req.cookies[cookieNames.AUTHENTICATION]);

export default setupAuthentication;
