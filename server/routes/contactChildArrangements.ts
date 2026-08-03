import { Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';

import { CONTACT_CHILD_ARRANGEMENTS } from '../constants/formFields';
import FormSteps from '../constants/formSteps';
import checkFormProgressFromConfig from '../middleware/checkFormProgressFromConfig';
import addCompletedStep from '../utils/addCompletedStep';
import { getLocalizedPath } from '../utils/localizedPaths';
import { redirectToPath, registerLocalizedGet, registerLocalizedPost } from '../utils/registerLocalizedRoutes';
import { getBackUrl } from '../utils/sessionHelpers';

const router = Router();

// Question 2 - Contact Child Arrangements
registerLocalizedGet(
  router,
  'CONTACT_CHILD_ARRANGEMENTS',
  checkFormProgressFromConfig(FormSteps.CONTACT_CHILD_ARRANGEMENTS),
  (req: Request, res: Response) => {
    const errors = req.flash('errors');
    res.render('pages/contactChildArrangements', {
      title: res.__('pages.contactChildArrangements.title'),
      backLinkHref: getBackUrl(req.session, getLocalizedPath('DOMESTIC_ABUSE', res.getLocale())),
      errors,
      formValues: {
        contactChildArrangements: req.session.contactChildArrangements,
      },
    });
  },
);

registerLocalizedPost(
  router,
  'CONTACT_CHILD_ARRANGEMENTS',
  body(CONTACT_CHILD_ARRANGEMENTS)
    .notEmpty()
    .withMessage((_value, { req }) => req.__('pages.contactChildArrangements.error')),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('errors', errors.array());
      return redirectToPath(res, 'CONTACT_CHILD_ARRANGEMENTS');
    }

    req.session.contactChildArrangements = req.body.contactChildArrangements;
    addCompletedStep(req, FormSteps.CONTACT_CHILD_ARRANGEMENTS);

    if (req.body.contactChildArrangements === 'yes') {
      return redirectToPath(res, 'AGREEMENT');
    }

    if (req.body.contactChildArrangements === 'no') {
      return redirectToPath(res, 'OPTIONS_NO_CONTACT');
    }

    return redirectToPath(res, 'COURT_ORDER');
  },
);

export default router;
