import { Request, Response, Router } from 'express';

import { getLocalizedPath } from '../utils/localizedPaths';
import { registerLocalizedGet } from '../utils/registerLocalizedRoutes';

const router = Router();

registerLocalizedGet(router, 'OPTIONS_NO_CONTACT', (req: Request, res: Response) => {
  res.render('pages/optionsNoContact', {
    title: res.__('pages.optionsNoContact.title'),
    backLinkHref: getLocalizedPath('CONTACT_CHILD_ARRANGEMENTS', res.getLocale()),
  });
});

export default router;
