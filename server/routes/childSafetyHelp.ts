import { Request, Response, Router } from 'express';

import { getLocalizedPath } from '../utils/localizedPaths';
import { registerLocalizedGet } from '../utils/registerLocalizedRoutes';
import { getBackUrl } from '../utils/sessionHelpers';

const router = Router();

registerLocalizedGet(router, 'CHILD_SAFETY_HELP', (req: Request, res: Response) => {
  res.render('pages/childSafetyHelp', {
    title: res.__('pages.childSafetyHelp.title'),
    backLinkHref: getBackUrl(req.session, getLocalizedPath('CHILD_SAFETY', res.getLocale())),
  });
});

export default router;
