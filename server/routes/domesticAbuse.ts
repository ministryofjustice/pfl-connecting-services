import { Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';

import paths from '../constants/paths';

const router = Router();

/**
 * Domestic Abuse Question
 *
 * Routing logic:
 *   - YES → Safeguarding page (/getting-help)
 *   - NO  → Contact comfort page (/contact-comfort)
 */
router.get(paths.DOMESTIC_ABUSE, (req: Request, res: Response) => {
  const errors = req.flash('errors');
  res.render('pages/domesticAbuse', {
    title: res.__('pages.domesticAbuse.title'),
    backLinkHref: paths.START,
    errors,
    formValues: {
      abuse: req.session.abuse,
    },
  });
});

router.post(
  paths.DOMESTIC_ABUSE,
  body('abuse')
    .notEmpty()
    .withMessage((_value, { req }) => req.__('pages.domesticAbuse.error')),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('errors', errors.array());
      return res.redirect(paths.DOMESTIC_ABUSE);
    }

    req.session.abuse = req.body.abuse;

    if (req.body.abuse === 'yes') {
      return res.redirect(paths.SAFEGUARDING);
    }
    return res.redirect(paths.CONTACT_COMFORT);
  }
);

export default router;
