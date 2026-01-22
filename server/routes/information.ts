import { Request, Response, Router } from 'express';

import paths from '../constants/paths';

const router = Router();

router.get(paths.GUIDE, (req: Request, res: Response) => {
  res.render('pages/guide', {
    title: res.__('pages.guide.title'),
    backLinkHref: paths.START,
  });
});

router.get(paths.STEPS, (req: Request, res: Response) => {
  res.render('pages/steps', {
    title: res.__('pages.steps.title'),
    backLinkHref: paths.START,
  });
});

router.get(paths.COMPARE, (req: Request, res: Response) => {
  res.render('pages/compare', {
    title: res.__('pages.compare.title'),
    backLinkHref: paths.START,
  });
});

router.get(paths.SERVICE_FINDER, (req: Request, res: Response) => {
  res.render('pages/service-finder', {
    title: res.__('pages.serviceFinder.title'),
    backLinkHref: paths.START,
  });
});

export default router;
