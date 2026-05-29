import { Request, Response, Router } from 'express';

import FormSteps from '../constants/formSteps';
import paths from '../constants/paths';
import addCompletedStep from '../utils/addCompletedStep';

const router = Router();

router.get(paths.START, (req: Request, res: Response) => {

  // Mark START as completed so user can proceed to CHILD_SAFETY
  addCompletedStep(req, FormSteps.START);

  res.render('pages/start', {
    title: res.__('pages.start.title'),
  });
});

export default router;
