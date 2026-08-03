import { Request, Response, Router } from 'express';

import { getLocalizedPath } from '../utils/localizedPaths';
import { registerLocalizedGet } from '../utils/registerLocalizedRoutes';

const router = Router();

registerLocalizedGet(router, 'SAFEGUARDING', (req: Request, res: Response) => {
  res.render('pages/safeguarding', {
    title: res.__('pages.safeguarding.title'),
    backLinkHref: getLocalizedPath('DOMESTIC_ABUSE', res.getLocale()),
  });
});

export default router;
