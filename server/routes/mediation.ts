import { Request, Response, Router } from 'express';

import { getLocalizedPath } from '../utils/localizedPaths';
import { registerLocalizedGet } from '../utils/registerLocalizedRoutes';
import { getBackUrl } from '../utils/sessionHelpers';

const router = Router();

// Mediation
registerLocalizedGet(router, 'MEDIATION', (req: Request, res: Response) => {
  res.render('pages/mediation', {
    title: res.__('pages.mediation.title'),
    backLinkHref: getBackUrl(req.session, getLocalizedPath('OTHER_OPTIONS', res.getLocale())),
    domesticAbuse: req.session.domesticAbuse,
    childSafety: req.session.childSafety,
  });
});

export default router;
