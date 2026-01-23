import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import paths from '../constants/paths';

const router = Router();

/**
 * Question 1: Safeguarding / Abuse
 *
 * Routing logic:
 *   - YES ──────────────→ Safeguarding Page
 *   - PREFER NOT TO SAY ─→ Safeguarding Page (cautious approach)
 *   - NO ───────────────→ Question 2 (Contact)
 */
router.get(paths.QUESTION_1_ABUSE, (req: Request, res: Response) => {
  const errors = req.flash('errors');
  res.render('pages/question-1', {
    title: res.__('pages.question1.title'),
    backLinkHref: paths.START,
    errors,
    formValues: {
      abuse: req.session.abuse,
    },
  });
});

router.post(
  paths.QUESTION_1_ABUSE,
  body('abuse').notEmpty().withMessage('Select an option'),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('errors', errors.array() as any);
      return res.redirect(paths.QUESTION_1_ABUSE);
    }

    req.session.abuse = req.body.abuse;

    // Route to safeguarding page for 'yes' or 'prefer-not-to-say' (cautious approach)
    if (req.body.abuse === 'yes' || req.body.abuse === 'prefer-not-to-say') {
      return res.redirect(paths.SAFEGUARDING);
    }
    // Only 'no' continues to the next question
    return res.redirect(paths.QUESTION_2_CONTACT);
  }
);

// Question 2: Contact
router.get(paths.QUESTION_2_CONTACT, (req: Request, res: Response) => {
  const errors = req.flash('errors');
  res.render('pages/question-2', {
    title: res.__('pages.question2.title'),
    backLinkHref: paths.QUESTION_1_ABUSE,
    errors,
    formValues: {
      contact: req.session.contact,
    },
  });
});

router.post(
  paths.QUESTION_2_CONTACT,
  body('contact').notEmpty().withMessage('Select an option'),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('errors', errors.array() as any);
      return res.redirect(paths.QUESTION_2_CONTACT);
    }

    req.session.contact = req.body.contact;

    if (req.body.contact === 'yes') {
      return res.redirect(paths.QUESTION_3_AGREE);
    } else if (req.body.contact === 'no-details') {
      return res.redirect(paths.COURT);
    }
    return res.redirect(paths.NO_CONTACT);
  }
);

// Question 3: Agree
router.get(paths.QUESTION_3_AGREE, (req: Request, res: Response) => {
  const errors = req.flash('errors');
  res.render('pages/question-3', {
    title: res.__('pages.question3.title'),
    backLinkHref: paths.QUESTION_2_CONTACT,
    errors,
    formValues: {
      agree: req.session.agree,
    },
  });
});

router.post(
  paths.QUESTION_3_AGREE,
  body('agree').notEmpty().withMessage('Select an option'),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('errors', errors.array() as any);
      return res.redirect(paths.QUESTION_3_AGREE);
    }

    req.session.agree = req.body.agree;

    if (req.body.agree === 'yes') {
      return res.redirect(paths.PARENTING_PLAN);
    }
    return res.redirect(paths.QUESTION_4_HELP);
  }
);

// Question 4: Help
router.get(paths.QUESTION_4_HELP, (req: Request, res: Response) => {
  const errors = req.flash('errors');
  res.render('pages/question-4', {
    title: res.__('pages.question4.title'),
    backLinkHref: paths.QUESTION_3_AGREE,
    errors,
    formValues: {
      help: req.session.help,
    },
  });
});

router.post(
  paths.QUESTION_4_HELP,
  body('help').notEmpty().withMessage('Select an option'),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('errors', errors.array() as any);
      return res.redirect(paths.QUESTION_4_HELP);
    }

    req.session.help = req.body.help;

    if (req.body.help === 'plan') {
      return res.redirect(paths.PARENTING_PLAN);
    } else if (req.body.help === 'cannot') {
      return res.redirect(paths.COURT);
    }
    return res.redirect(paths.QUESTION_5_MEDIATION);
  }
);

// Question 5: Mediation
router.get(paths.QUESTION_5_MEDIATION, (req: Request, res: Response) => {
  const errors = req.flash('errors');
  res.render('pages/question-5', {
    title: res.__('pages.question5.title'),
    backLinkHref: paths.QUESTION_4_HELP,
    errors,
    formValues: {
      mediation: req.session.mediation,
    },
  });
});

router.post(
  paths.QUESTION_5_MEDIATION,
  body('mediation').notEmpty().withMessage('Select an option'),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('errors', errors.array() as any);
      return res.redirect(paths.QUESTION_5_MEDIATION);
    }

    req.session.mediation = req.body.mediation;

    if (req.body.mediation === 'yes') {
      return res.redirect(paths.COURT);
    }
    return res.redirect(paths.MEDIATION);
  }
);

export default router;
