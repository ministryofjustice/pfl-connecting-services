import { Request, Response, Router } from 'express';

import paths from '../constants/paths';

const router = Router();

router.get(paths.NO_CONTACT, (req: Request, res: Response) => {
  res.render('pages/noContact', {
    title: res.__('pages.noContact.title'),
    backLinkHref: paths.CONTACT_CHILD_ARRANGEMENTS,
  });
});

export default router;
