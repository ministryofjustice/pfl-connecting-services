import { Request, Response, Router } from 'express';

import paths from '../constants/paths';

const router = Router();

router.get(paths.NO_CONTACT_GUIDANCE, (req: Request, res: Response) => {
  res.render('pages/noContactGuidance', {
    title: res.__('pages.noContactGuidance.title'),
    backLinkHref: paths.CONTACT_CHILD_ARRANGEMENTS,
  });
});

export default router;
