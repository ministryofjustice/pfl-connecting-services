import { Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';

import { DOMESTIC_ABUSE } from '../constants/formFields';
import FormSteps from '../constants/formSteps';
import paths from '../constants/paths';
import checkFormProgressFromConfig from '../middleware/checkFormProgressFromConfig';
import addCompletedStep from '../utils/addCompletedStep';
import { getLocalizedPath } from '../utils/localizedPaths';
import { redirectToPath, registerLocalizedGet, registerLocalizedPost } from '../utils/registerLocalizedRoutes';
import { getBackUrl } from '../utils/sessionHelpers';

const router = Router();

/**
 * Domestic Abuse Question
 *
 * Routing logic:
 *   - YES → Safeguarding page (/getting-help)
 *   - NO  → Contact child arrangements page (/contact-child-arrangements)
 */
registerLocalizedGet(
  router,
  'DOMESTIC_ABUSE',
  checkFormProgressFromConfig(FormSteps.DOMESTIC_ABUSE),
  (req: Request, res: Response) => {
    const errors = req.flash('errors');
    res.render('pages/domesticAbuse', {
      title: res.__('pages.domesticAbuse.title'),
      backLinkHref: getBackUrl(req.session, getLocalizedPath('CHILD_SAFETY', res.getLocale())),
      errors,
      formValues: {
        domesticAbuse: req.session.domesticAbuse,
      },
    });
  },
);

registerLocalizedPost(
  router,
  'DOMESTIC_ABUSE',
  body(DOMESTIC_ABUSE)
    .notEmpty()
    .withMessage((_value, { req }) => req.__('pages.domesticAbuse.error')),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('errors', errors.array());
      return redirectToPath(res, 'DOMESTIC_ABUSE');
    }

    req.session.domesticAbuse = req.body.domesticAbuse;
    addCompletedStep(req, FormSteps.DOMESTIC_ABUSE);

    if (req.body.domesticAbuse === 'no') {
      return redirectToPath(res, 'CONTACT_CHILD_ARRANGEMENTS');
    }
    return redirectToPath(res, 'SAFEGUARDING');
  },
);

export default router;
