import { Request, Response, Router } from 'express';

import paths from '../constants/paths';
import { getBackUrl } from '../utils/sessionHelpers';

const router = Router();

// Mediation
router.get(paths.MEDIATION, (req: Request, res: Response) => {
  res.render('pages/mediation', {
    title: res.__('pages.mediation.title'),
    backLinkHref: getBackUrl(req.session, paths.OTHER_OPTIONS),
    abuse: req.session.abuse
  });
});

export default router;
