import { Request, Response, Router } from 'express';

import paths from '../constants/paths';
import { getBackUrl } from '../utils/sessionHelpers';

const router = Router();

router.get(paths.CHILD_SAFETY_HELP, (req: Request, res: Response) => {
  res.render('pages/childSafetyHelp', {
    title: res.__('pages.childSafetyHelp.title'),
    backLinkHref: getBackUrl(req.session, paths.CHILD_SAFETY),
  });
});

export default router;
