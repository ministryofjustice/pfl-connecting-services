import { Request, Response, Router } from 'express';

import paths from '../constants/paths';

const router = Router();

router.get(paths.COURT_ORDER, (req: Request, res: Response) => {
  res.render('pages/courtOrder', {
    title: res.__('pages.courtOrder.title'),
    backLinkHref: paths.OTHER_OPTIONS,
  });
});

router.get(paths.PARENTING_PLAN, (req: Request, res: Response) => {
  res.render('pages/parenting-plan', {
    title: res.__('pages.parentingPlan.title'),
    backLinkHref: req.headers.referer || paths.START,
  });
});

router.get(paths.SAFEGUARDING, (req: Request, res: Response) => {
  res.render('pages/safeguarding', {
    title: res.__('pages.safeguarding.title'),
    backLinkHref: paths.DOMESTIC_ABUSE,
  });
});

export default router;
