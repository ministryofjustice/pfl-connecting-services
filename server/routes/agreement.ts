import { Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';

import { AGREEMENT } from '../constants/formFields';
import FormSteps from '../constants/formSteps';
import checkFormProgressFromConfig from '../middleware/checkFormProgressFromConfig';
import addCompletedStep from '../utils/addCompletedStep';
import { getLocalizedPath } from '../utils/localizedPaths';
import { redirectToPath, registerLocalizedGet, registerLocalizedPost } from '../utils/registerLocalizedRoutes';

const router = Router();

/**
 * Agreement on child arrangements Question
 *
 * Routing logic:
 *   - Yes → Parenting plan page (/parenting-plan)
 *   - No → Help to agree page (/help-to-agree)
 *   - Not discussed yet → Help to agree page (/help-to-agree)
 */
registerLocalizedGet(router, 'AGREEMENT', checkFormProgressFromConfig(FormSteps.AGREEMENT), (req: Request, res: Response) => {
  const errors = req.flash('errors');
  res.render('pages/agreement', {
    title: res.__('pages.agreement.title'),
    backLinkHref: getLocalizedPath('CONTACT_CHILD_ARRANGEMENTS', res.getLocale()),
    errors,
    formValues: {
      agreement: req.session.agreement,
    },
  });
});

registerLocalizedPost(
  router,
  'AGREEMENT',
  body(AGREEMENT)
    .notEmpty()
    .withMessage((_value, { req }) => req.__('pages.agreement.error')),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('errors', errors.array());
      return redirectToPath(res, 'AGREEMENT');
    }

    req.session.agreement = req.body.agreement;
    addCompletedStep(req, FormSteps.AGREEMENT);

    if (req.body.agreement === 'yes') {
      return redirectToPath(res, 'PARENTING_PLAN');
    }
    return redirectToPath(res, 'HELP_TO_AGREE');
  },
);

export default router;
