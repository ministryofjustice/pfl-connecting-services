import { Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';

import { HELP_TO_AGREE } from '../constants/formFields';
import FormSteps from '../constants/formSteps';
import paths from '../constants/paths';
import checkFormProgressFromConfig from '../middleware/checkFormProgressFromConfig';
import addCompletedStep from '../utils/addCompletedStep';

const router = Router();

// Question 4 - Help to Agree
router.get(paths.HELP_TO_AGREE, checkFormProgressFromConfig(FormSteps.HELP_TO_AGREE), (req: Request, res: Response) => {
  const errors = req.flash('errors');
  res.render('pages/helpToAgree', {
    title: res.__('pages.helpToAgree.title'),
    backLinkHref: paths.AGREEMENT,
    errors,
    formValues: {
      helpToAgree: req.session.helpToAgree,
    },
  });
});

router.post(
  paths.HELP_TO_AGREE,
  body(HELP_TO_AGREE)
    .notEmpty()
    .withMessage((_value, { req }) => req.__('pages.helpToAgree.error')),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('errors', errors.array());
      return res.redirect(paths.HELP_TO_AGREE);
    }

    req.session.helpToAgree = req.body.helpToAgree;
    addCompletedStep(req, FormSteps.HELP_TO_AGREE);

    if (req.body.helpToAgree === 'plan') {
      return res.redirect(paths.PARENTING_PLAN);
    } else if (req.body.helpToAgree === 'cannot') {
      return res.redirect(paths.COURT_ORDER);
    }
    return res.redirect(paths.OTHER_OPTIONS);
  }
);

export default router;
