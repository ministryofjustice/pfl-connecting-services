import { Request, Response, Router } from 'express';

import paths from '../constants/paths';

const router = Router();

router.get(paths.THROUGH_SOMEONE_ELSE, (req: Request, res: Response) => {
  res.render('pages/throughSomeoneElse', {
    title: res.__('pages.throughSomeoneElse.title'),
    backLinkHref: paths.CONTACT_CHILD_ARRANGEMENTS,
  });
});

export default router;
