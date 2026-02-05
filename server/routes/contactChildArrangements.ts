import { Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';

import FormSteps from '../constants/formSteps';
import paths from '../constants/paths';
import checkFormProgressFromConfig from '../middleware/checkFormProgressFromConfig';
import addCompletedStep from '../utils/addCompletedStep';

const router = Router();

// Question 2 - Contact Child Arrangements
router.get(paths.CONTACT_CHILD_ARRANGEMENTS, checkFormProgressFromConfig(FormSteps.CONTACT_CHILD_ARRANGEMENTS), (req: Request, res: Response) => {
  const errors = req.flash('errors');
  res.render('pages/contactChildArrangements', {
    title: res.__('pages.contactChildArrangements.title'),
    backLinkHref: paths.DOMESTIC_ABUSE,
    errors,
    formValues: {
      contact: req.session.contact,
    },
  });
});

router.post(
  paths.CONTACT_CHILD_ARRANGEMENTS,
  body('contact')
    .notEmpty()
    .withMessage((_value, { req }) => req.__('pages.contactChildArrangements.error')),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('errors', errors.array());
      return res.redirect(paths.CONTACT_CHILD_ARRANGEMENTS);
    }

    req.session.contact = req.body.contact;
    addCompletedStep(req, FormSteps.CONTACT_CHILD_ARRANGEMENTS);

    if (req.body.contact === 'yes') {
      return res.redirect(paths.AGREEMENT);
    }

    if (req.body.contact === 'no-details') {
      return res.redirect(paths.COURT_ORDER);
    }

    return res.redirect(paths.OPTIONS_NO_CONTACT);
  }
);

export default router;
