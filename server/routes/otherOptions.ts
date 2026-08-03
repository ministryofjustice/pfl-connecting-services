import { Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';

import FormSteps from '../constants/formSteps';
import checkFormProgressFromConfig from '../middleware/checkFormProgressFromConfig';
import addCompletedStep from '../utils/addCompletedStep';
import { getLocalizedPath } from '../utils/localizedPaths';
import { redirectToPath, registerLocalizedGet, registerLocalizedPost } from '../utils/registerLocalizedRoutes';

const router = Router();

// Other options
registerLocalizedGet(
  router,
  'OTHER_OPTIONS',
  checkFormProgressFromConfig(FormSteps.OTHER_OPTIONS),
  (req: Request, res: Response) => {
    const errors = req.flash('errors');
    res.render('pages/otherOptions', {
      title: res.__('pages.otherOptions.title'),
      backLinkHref: getLocalizedPath('HELP_TO_AGREE', res.getLocale()),
      errors,
      formValues: {
        mediation: req.session.mediation,
      },
    });
  },
);

registerLocalizedPost(
  router,
  'OTHER_OPTIONS',
  body('otherOptions')
    .notEmpty()
    .withMessage((_value, { req }) => req.__('pages.otherOptions.error')),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('errors', errors.array());
      return redirectToPath(res, 'OTHER_OPTIONS');
    }

    req.session.otherOptions = req.body.otherOptions;
    addCompletedStep(req, FormSteps.OTHER_OPTIONS);

    if (req.session.otherOptions === 'yes') {
      return redirectToPath(res, 'COURT_ORDER');
    }
    return redirectToPath(res, 'MEDIATION');
  },
);

export default router;
