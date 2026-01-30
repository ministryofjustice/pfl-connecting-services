import { Request, Response, Router } from 'express';

import paths from '../constants/paths';

const router = Router();

router.get(paths.COURT, (req: Request, res: Response) => {
  res.render('pages/court', {
    title: res.__('pages.court.title'),
    backLinkHref: req.headers.referer || paths.START,
  });
});

router.get(paths.MEDIATION, (req: Request, res: Response) => {
  res.render('pages/mediation', {
    title: res.__('pages.mediation.title'),
    backLinkHref: paths.MEDIATION_CHECK,
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

router.get(paths.NO_CONTACT, (req: Request, res: Response) => {
  res.render('pages/no-contact', {
    title: res.__('pages.noContact.title'),
    backLinkHref: paths.CONTACT_COMFORT,
  });
});

export default router;
