import { Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';

import FormSteps from '../constants/formSteps';
import paths from '../constants/paths';
import checkFormProgressFromConfig from '../middleware/checkFormProgressFromConfig';
import addCompletedStep from '../utils/addCompletedStep';

const router = Router();

/**
 * Agreement on child arrangements Question
 *
 * Routing logic:
 *   - Yes → Parenting plan page (/parenting-plan)
 *   - No → Help to agree page (/help-to-agree)
 *   - Not discussed yet → Help to agree page (/help-to-agree)
 */
router.get(paths.AGREEMENT, checkFormProgressFromConfig(FormSteps.AGREEMENT), (req: Request, res: Response) => {
  const errors = req.flash('errors');
  res.render('pages/agreement', {
    title: res.__('pages.agreement.title'),
    backLinkHref: paths.CONTACT_CHILD_ARRANGEMENTS,
    errors,
    formValues: {
      agreement: req.session.agreement,
    },
  });
});

router.post(
  paths.AGREEMENT,
  body('agreement')
    .notEmpty()
    .withMessage((_value, { req }) => req.__('pages.agreement.error')),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('errors', errors.array());
      return res.redirect(paths.AGREEMENT);
    }

    req.session.agreement = req.body.agreement;
    addCompletedStep(req, FormSteps.AGREEMENT);

    if (req.body.agreement === 'yes') {
      return res.redirect(paths.PARENTING_PLAN);
    }
    return res.redirect(paths.HELP_TO_AGREE);
  }
);

export default router;
