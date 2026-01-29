import { Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';

import paths from '../constants/paths';

const router = Router();

// Question 5 - Mediation Check
router.get(paths.MEDIATION_CHECK, (req: Request, res: Response) => {
  const errors = req.flash('errors');
  res.render('pages/mediationCheck', {
    title: res.__('pages.question5.title'),
    backLinkHref: paths.HELP_OPTIONS,
    errors,
    formValues: {
      mediation: req.session.mediation,
    },
  });
});

router.post(
  paths.MEDIATION_CHECK,
  body('mediation').notEmpty().withMessage('Select an option'),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('errors', errors.array());
      return res.redirect(paths.MEDIATION_CHECK);
    }

    req.session.mediation = req.body.mediation;

    if (req.body.mediation === 'yes') {
      return res.redirect(paths.COURT);
    }
    return res.redirect(paths.MEDIATION);
  }
);

export default router;
