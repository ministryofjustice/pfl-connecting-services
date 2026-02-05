import { Request, Response, Router } from 'express';

import paths from '../constants/paths';

const router = Router();

router.get(paths.OPTIONS_NO_CONTACT, (req: Request, res: Response) => {
  res.render('pages/optionsNoContact', {
    title: res.__('pages.optionsNoContact.title'),
    backLinkHref: paths.CONTACT_CHILD_ARRANGEMENTS,
  });
});

export default router;
