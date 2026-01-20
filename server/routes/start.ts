import { Router, Request, Response } from 'express';
import paths from '../constants/paths';

const router = Router();

router.get(paths.START, (req: Request, res: Response) => {
  // Clear session on start
  req.session.abuse = undefined;
  req.session.contact = undefined;
  req.session.agree = undefined;
  req.session.help = undefined;
  req.session.mediation = undefined;

  res.render('pages/start', {
    title: res.__('pages.start.title'),
  });
});

export default router;
