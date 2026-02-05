import { Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';

import FormSteps from '../constants/formSteps';
import paths from '../constants/paths';
import checkFormProgressFromConfig from '../middleware/checkFormProgressFromConfig';
import addCompletedStep from '../utils/addCompletedStep';

const router = Router();

// Question 4 - Help Options
router.get(paths.HELP_OPTIONS, checkFormProgressFromConfig(FormSteps.HELP_OPTIONS), (req: Request, res: Response) => {
  const errors = req.flash('errors');
  res.render('pages/helpOptions', {
    title: res.__('pages.helpOptions.title'),
    backLinkHref: paths.AGREEMENT,
    errors,
    formValues: {
      help: req.session.help,
    },
  });
});

router.post(
  paths.HELP_OPTIONS,
  body('help').notEmpty().withMessage('Select an option'),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('errors', errors.array());
      return res.redirect(paths.HELP_OPTIONS);
    }

    req.session.help = req.body.help;
    addCompletedStep(req, FormSteps.HELP_OPTIONS);

    if (req.body.help === 'plan') {
      return res.redirect(paths.PARENTING_PLAN);
    } else if (req.body.help === 'cannot') {
      return res.redirect(paths.COURT_ORDER);
    }
    return res.redirect(paths.MEDIATION_CHECK);
  }
);

export default router;
