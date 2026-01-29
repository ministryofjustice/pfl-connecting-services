import { Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';

import paths from '../constants/paths';

const router = Router();

// Question 2 - Contact Arrangements
router.get(paths.CONTACT_COMFORT, (req: Request, res: Response) => {
  const errors = req.flash('errors');
  res.render('pages/contactComfort', {
    title: res.__('pages.question2.title'),
    backLinkHref: paths.DOMESTIC_ABUSE,
    errors,
    formValues: {
      contact: req.session.contact,
    },
  });
});

router.post(
  paths.CONTACT_COMFORT,
  body('contact').notEmpty().withMessage('Select an option'),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('errors', errors.array());
      return res.redirect(paths.CONTACT_COMFORT);
    }

    req.session.contact = req.body.contact;

    if (req.body.contact === 'yes') {
      return res.redirect(paths.AGREEMENT);
    } else if (req.body.contact === 'no-details') {
      return res.redirect(paths.COURT);
    }
    return res.redirect(paths.NO_CONTACT);
  }
);

export default router;
