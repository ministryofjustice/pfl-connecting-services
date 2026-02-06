import { Request, Response, Router } from 'express';

import FormSteps from '../constants/formSteps';
import paths from '../constants/paths';
import checkFormProgressFromConfig from '../middleware/checkFormProgressFromConfig';

const router = Router();

// Mediation
router.get(paths.MEDIATION, checkFormProgressFromConfig(FormSteps.MEDIATION), (req: Request, res: Response) => {
  console.log(req.session.abuse);
  res.render('pages/mediation', {
    title: res.__('pages.mediation.title'),
    backLinkHref: paths.MEDIATION_CHECK,
    abuse: req.session.abuse
  });
});

export default router;
