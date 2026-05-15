import { Request, Response, Router } from 'express';

import config from '../config';
import paths from '../constants/paths';
import { getBackUrl } from '../utils/sessionHelpers';

const router = Router();

router.get(paths.COURT_ORDER, (req: Request, res: Response) => {
  res.render('pages/courtOrder', {
    title: res.__('pages.courtOrder.title'),
    backLinkHref: getBackUrl(req.session, config.serviceUrl),
    domesticAbuse: req.session.domesticAbuse,
    childSafety: req.session.childSafety,
  });
});

export default router;
