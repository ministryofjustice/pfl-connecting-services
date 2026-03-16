import { Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';

import FormSteps from '../constants/formSteps';
import paths from '../constants/paths';
import checkFormProgressFromConfig from '../middleware/checkFormProgressFromConfig';
import addCompletedStep from '../utils/addCompletedStep';

const router = Router();

/**
 * Child Safety Question
 *
 * Routing logic:
 *   - YES (children are safe) → Domestic abuse page (/domestic-abuse)
 *   - NO (children are not safe) → Child safety help page (/child-safety-help)
 */
router.get(paths.CHILD_SAFETY, checkFormProgressFromConfig(FormSteps.CHILD_SAFETY), (req: Request, res: Response) => {
  const errors = req.flash('errors');
  res.render('pages/childSafety', {
    title: res.__('pages.childSafety.title'),
    backLinkHref: paths.START,
    errors,
    formValues: {
      childSafety: req.session.childSafety,
    },
  });
});

router.post(
  paths.CHILD_SAFETY,
  body('childSafety')
    .notEmpty()
    .withMessage((_value, { req }) => req.__('pages.childSafety.error')),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('errors', errors.array());
      return res.redirect(paths.CHILD_SAFETY);
    }

    req.session.childSafety = req.body.childSafety;
    addCompletedStep(req, FormSteps.CHILD_SAFETY);

    if (req.body.childSafety === 'yes') {
      return res.redirect(paths.DOMESTIC_ABUSE);
    }
    return res.redirect(paths.CHILD_SAFETY_HELP);
  },
);

export default router;
