import { Request, Response, Router } from 'express';

import paths from '../constants/paths';
import { getBackUrl } from '../utils/sessionHelpers';

const router = Router();

router.get(paths.PARENTING_PLAN, (req: Request, res: Response) => {
  res.render('pages/parenting-plan', {
    title: res.__('pages.parentingPlan.title'),
    backLinkHref: getBackUrl(req.session, paths.START),
    abuse: req.session.abuse,
  });
});

export default router;
