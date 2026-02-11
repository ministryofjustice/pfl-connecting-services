import { Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';

import FormSteps from '../constants/formSteps';
import paths from '../constants/paths';
import checkFormProgressFromConfig from '../middleware/checkFormProgressFromConfig';
import addCompletedStep from '../utils/addCompletedStep';

const router = Router();

// Other options
router.get(paths.OTHER_OPTIONS, checkFormProgressFromConfig(FormSteps.OTHER_OPTIONS), (req: Request, res: Response) => {
  const errors = req.flash('errors');
  res.render('pages/otherOptions', {
    title: res.__('pages.otherOptions.title'),
    backLinkHref: paths.HELP_TO_AGREE,
    errors,
    formValues: {
      mediation: req.session.mediation,
    },
  });
});

router.post(
  paths.OTHER_OPTIONS,
  body('otherOptions')
    .notEmpty()
    .withMessage((_value, { req }) => req.__('pages.otherOptions.error')),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('errors', errors.array());
      return res.redirect(paths.OTHER_OPTIONS);
    }

    req.session.otherOptions = req.body.otherOptions;
    addCompletedStep(req, FormSteps.OTHER_OPTIONS);

    if (req.session.otherOptions === 'yes') {
      return res.redirect(paths.COURT_ORDER);
    }
    return res.redirect(paths.MEDIATION);
  }
);

export default router;
