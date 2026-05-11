import { Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';

import { DOMESTIC_ABUSE } from '../constants/formFields';
import FormSteps from '../constants/formSteps';
import paths from '../constants/paths';
import checkFormProgressFromConfig from '../middleware/checkFormProgressFromConfig';
import addCompletedStep from '../utils/addCompletedStep';
import { getBackUrl } from '../utils/sessionHelpers';

const router = Router();

/**
 * Domestic Abuse Question
 *
 * Routing logic:
 *   - YES → Safeguarding page (/getting-help)
 *   - NO  → Contact child arrangements page (/contact-child-arrangements)
 */
router.get(
  paths.DOMESTIC_ABUSE,
  checkFormProgressFromConfig(FormSteps.DOMESTIC_ABUSE),
  (req: Request, res: Response) => {
    const errors = req.flash('errors');
    res.render('pages/domesticAbuse', {
      title: res.__('pages.domesticAbuse.title'),
      backLinkHref: getBackUrl(req.session, paths.CHILD_SAFETY),
      errors,
      formValues: {
        domesticAbuse: req.session.domesticAbuse,
      },
    });
  },
);

router.post(
  paths.DOMESTIC_ABUSE,
  body(DOMESTIC_ABUSE)
    .notEmpty()
    .withMessage((_value, { req }) => req.__('pages.domesticAbuse.error')),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('errors', errors.array());
      return res.redirect(paths.DOMESTIC_ABUSE);
    }

    req.session.domesticAbuse = req.body.domesticAbuse;
    addCompletedStep(req, FormSteps.DOMESTIC_ABUSE);

    if (req.body.domesticAbuse === 'yes') {
      return res.redirect(paths.SAFEGUARDING);
    }
    return res.redirect(paths.CONTACT_CHILD_ARRANGEMENTS);
  },
);

export default router;
