import { Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';

import { HELP_TO_AGREE } from '../constants/formFields';
import FormSteps from '../constants/formSteps';
import checkFormProgressFromConfig from '../middleware/checkFormProgressFromConfig';
import addCompletedStep from '../utils/addCompletedStep';
import { getLocalizedPath } from '../utils/localizedPaths';
import { redirectToPath, registerLocalizedGet, registerLocalizedPost } from '../utils/registerLocalizedRoutes';

const router = Router();

// Question 4 - Help to Agree
registerLocalizedGet(
  router,
  'HELP_TO_AGREE',
  checkFormProgressFromConfig(FormSteps.HELP_TO_AGREE),
  (req: Request, res: Response) => {
    const errors = req.flash('errors');
    res.render('pages/helpToAgree', {
      title: res.__('pages.helpToAgree.title'),
      backLinkHref: getLocalizedPath('AGREEMENT', res.getLocale()),
      errors,
      formValues: {
        helpToAgree: req.session.helpToAgree,
      },
    });
  },
);

registerLocalizedPost(
  router,
  'HELP_TO_AGREE',
  body(HELP_TO_AGREE)
    .notEmpty()
    .withMessage((_value, { req }) => req.__('pages.helpToAgree.error')),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('errors', errors.array());
      return redirectToPath(res, 'HELP_TO_AGREE');
    }

    req.session.helpToAgree = req.body.helpToAgree;
    addCompletedStep(req, FormSteps.HELP_TO_AGREE);

    if (req.body.helpToAgree === 'plan') {
      return redirectToPath(res, 'PARENTING_PLAN');
    } else if (req.body.helpToAgree === 'cannot') {
      return redirectToPath(res, 'COURT_ORDER');
    }
    return redirectToPath(res, 'OTHER_OPTIONS');
  },
);

export default router;
