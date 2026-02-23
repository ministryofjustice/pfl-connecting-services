import { Request, Response, Router } from 'express';

import paths from '../constants/paths';
import { getBackUrl } from '../utils/sessionHelpers';

const router = Router();

router.get(paths.COURT_ORDER, (req: Request, res: Response) => {
  res.render('pages/courtOrder', {
    title: res.__('pages.courtOrder.title'),
    backLinkHref: getBackUrl(req.session, paths.START),
    abuse: req.session.abuse,
  });
});

export default router;
