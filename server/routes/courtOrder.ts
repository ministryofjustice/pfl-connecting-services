import { Request, Response, Router } from 'express';

import config from '../config';
import { getBackUrl } from '../utils/sessionHelpers';
import { registerLocalizedGet } from '../utils/registerLocalizedRoutes';

const router = Router();

registerLocalizedGet(router, 'COURT_ORDER', (req: Request, res: Response) => {
  res.render('pages/courtOrder', {
    title: res.__('pages.courtOrder.title'),
    backLinkHref: getBackUrl(req.session, config.serviceUrl),
    domesticAbuse: req.session.domesticAbuse,
    childSafety: req.session.childSafety,
  });
});

export default router;
