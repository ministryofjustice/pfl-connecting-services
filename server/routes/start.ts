import { Request, Response, Router } from 'express';

import FormSteps from '../constants/formSteps';
import paths from '../constants/paths';
import addCompletedStep from '../utils/addCompletedStep';

const router = Router();

router.get(paths.START, (req: Request, res: Response) => {
  // Clear session on start
  req.session.domesticAbuse = undefined;
  req.session.contactChildArrangements = undefined;
  req.session.agreement = undefined;
  req.session.helpToAgree = undefined;
  req.session.mediation = undefined;
  req.session.otherOptions = undefined;
  req.session.completedSteps = [];

  // Mark START as completed so user can proceed to DOMESTIC_ABUSE
  addCompletedStep(req, FormSteps.START);

  res.render('pages/start', {
    title: res.__('pages.start.title'),
  });
});

export default router;
