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

router.get(paths.PARENTING_PLAN, (req: Request, res: Response) => {
  res.render('pages/parenting-plan', {
    title: res.__('pages.parentingPlan.title'),
    backLinkHref: getBackUrl(req.session, paths.START),
    abuse: req.session.abuse,
  });
});

router.get(paths.SAFEGUARDING, (req: Request, res: Response) => {
  res.render('pages/safeguarding', {
    title: res.__('pages.safeguarding.title'),
    backLinkHref: paths.DOMESTIC_ABUSE,
  });
});

export default router;
