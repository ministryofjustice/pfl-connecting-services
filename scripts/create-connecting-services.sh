#!/bin/bash

# =============================================================================
# Script: create-connecting-services.sh
# Purpose: Duplicate CAP repo and convert it to Connecting Services
# Usage: ./scripts/create-connecting-services.sh [target-directory]
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DEFAULT_TARGET_DIR="../pfl-connecting-services-app"
TARGET_DIR="${1:-$DEFAULT_TARGET_DIR}"
PROTOTYPE_DIR="../pfl-connecting-services"
SOURCE_DIR="$(pwd)"

echo -e "${GREEN}=== Connecting Services App Generator ===${NC}"
echo ""

# Validate we're in the CAP repo
if [ ! -f "package.json" ] || ! grep -q "pfl-care-arrangement-plan" package.json; then
    echo -e "${RED}Error: This script must be run from the care-arrangement-plan root directory${NC}"
    exit 1
fi

# Check prototype exists
if [ ! -d "$PROTOTYPE_DIR" ]; then
    echo -e "${RED}Error: Prototype directory not found at $PROTOTYPE_DIR${NC}"
    echo "Please ensure pfl-connecting-services is cloned alongside this repo"
    exit 1
fi

# Check target doesn't already exist
if [ -d "$TARGET_DIR" ]; then
    echo -e "${YELLOW}Warning: Target directory $TARGET_DIR already exists${NC}"
    read -p "Do you want to remove it and continue? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf "$TARGET_DIR"
    else
        echo "Aborting."
        exit 1
    fi
fi

echo -e "${GREEN}Step 1: Copying CAP repo to $TARGET_DIR${NC}"
# Copy entire repo excluding git, node_modules, and dist
rsync -av --progress . "$TARGET_DIR" \
    --exclude .git \
    --exclude node_modules \
    --exclude dist \
    --exclude coverage \
    --exclude .env \
    --exclude "*.log"

cd "$TARGET_DIR"

echo ""
echo -e "${GREEN}Step 2: Removing CAP-specific files${NC}"

# Remove CAP-specific routes
echo "  - Removing CAP routes..."
rm -rf server/routes/aboutTheAdults.ts
rm -rf server/routes/aboutTheChildren.ts
rm -rf server/routes/checkYourAnswers.ts
rm -rf server/routes/childrenSafetyCheck.ts
rm -rf server/routes/confirmation.ts
rm -rf server/routes/courtOrderCheck.ts
rm -rf server/routes/decisionMaking
rm -rf server/routes/downloads.ts
rm -rf server/routes/doWhatsBest.ts
rm -rf server/routes/handoverAndHolidays
rm -rf server/routes/livingAndVisiting
rm -rf server/routes/numberOfChildren.ts
rm -rf server/routes/otherThings
rm -rf server/routes/safetyCheck.ts
rm -rf server/routes/sharePlan.ts
rm -rf server/routes/specialDays
rm -rf server/routes/taskList.ts

# Remove CAP-specific views (keep partials, macros, errors, and static pages)
echo "  - Removing CAP page templates..."
rm -rf server/views/pages/aboutTheAdults.njk
rm -rf server/views/pages/aboutTheChildren.njk
rm -rf server/views/pages/checkYourAnswers.njk
rm -rf server/views/pages/childrenNotSafe.njk
rm -rf server/views/pages/childrenSafetyCheck.njk
rm -rf server/views/pages/confirmation.njk
rm -rf server/views/pages/courtOrderCheck.njk
rm -rf server/views/pages/decisionMaking
rm -rf server/views/pages/downloads.njk
rm -rf server/views/pages/doWhatsBest.njk
rm -rf server/views/pages/existingCourtOrder.njk
rm -rf server/views/pages/handoverAndHolidays
rm -rf server/views/pages/livingAndVisiting
rm -rf server/views/pages/notSafe.njk
rm -rf server/views/pages/numberOfChildren.njk
rm -rf server/views/pages/otherThings
rm -rf server/views/pages/safetyCheck.njk
rm -rf server/views/pages/sharePlan.njk
rm -rf server/views/pages/specialDays
rm -rf server/views/pages/start.njk
rm -rf server/views/pages/taskList.njk

# Remove CAP-specific utilities
echo "  - Removing CAP-specific utilities..."
rm -rf server/pdf
rm -rf server/html
rm -rf server/utils/formattedAnswersForCheckAnswers.ts
rm -rf server/utils/formattedAnswersForPdf.ts
rm -rf server/utils/sectionCompleted.ts 2>/dev/null || true
rm -rf assets/other/paperForm.pdf

# Remove CAP-specific tests
echo "  - Removing CAP-specific tests..."
rm -rf server/__tests__/pdf
rm -rf server/__tests__/routes/aboutTheAdults.test.ts
rm -rf server/__tests__/routes/aboutTheChildren.test.ts
rm -rf server/__tests__/routes/checkYourAnswers.test.ts
rm -rf server/__tests__/routes/childrenSafetyCheck.test.ts
rm -rf server/__tests__/routes/confirmation.test.ts
rm -rf server/__tests__/routes/courtOrderCheck.test.ts
rm -rf server/__tests__/routes/decisionMaking
rm -rf server/__tests__/routes/downloads.test.ts
rm -rf server/__tests__/routes/doWhatsBest.test.ts
rm -rf server/__tests__/routes/handoverAndHolidays
rm -rf server/__tests__/routes/livingAndVisiting
rm -rf server/__tests__/routes/numberOfChildren.test.ts
rm -rf server/__tests__/routes/otherThings
rm -rf server/__tests__/routes/safetyCheck.test.ts
rm -rf server/__tests__/routes/sharePlan.test.ts
rm -rf server/__tests__/routes/specialDays
rm -rf server/__tests__/routes/taskList.test.ts

# Remove e2e tests (will need rewriting)
echo "  - Removing e2e tests (need rewriting for CS)..."
rm -rf e2e-tests/tests/*.spec.ts

echo ""
echo -e "${GREEN}Step 3: Creating new CS-specific files${NC}"

# Create new paths.ts for Connecting Services
echo "  - Creating new paths.ts..."
cat > server/constants/paths.ts << 'EOF'
enum paths {
  // Auth & static pages (keep from CAP)
  PASSWORD = '/password',
  START = '/',
  ACCESSIBILITY_STATEMENT = '/accessibility-statement',
  CONTACT_US = '/contact-us',
  COOKIES = '/cookies',
  PRIVACY_NOTICE = '/privacy-notice',
  TERMS_AND_CONDITIONS = '/terms-and-conditions',

  // Connecting Services specific paths
  QUESTION_1_ABUSE = '/question-1',
  SAFEGUARDING = '/safeguarding',
  CONTACT_COMFORT = '/contact-comfort',
  NO_CONTACT = '/no-contact',
  QUESTION_3_AGREE = '/question-3',
  QUESTION_4_HELP = '/question-4',
  QUESTION_5_MEDIATION = '/question-5',

  // Outcome pages
  COURT = '/court',
  MEDIATION = '/mediation',
  PARENTING_PLAN = '/parenting-plan',

  // Information pages
  GUIDE = '/guide',
  STEPS = '/steps',
  COMPARE = '/compare',
  SERVICE_FINDER = '/service-finder',
}

export default paths;
EOF

# Create new formFields.ts
echo "  - Creating new formFields.ts..."
cat > server/constants/formFields.ts << 'EOF'
// Form field names for Connecting Services
export const ABUSE = 'abuse';
export const CONTACT = 'contact';
export const AGREE = 'agree';
export const HELP = 'help';
export const MEDIATION = 'mediation';
EOF

# Create new formSteps.ts
echo "  - Creating new formSteps.ts..."
cat > server/constants/formSteps.ts << 'EOF'
enum FormSteps {
  START = 'START',
  QUESTION_1_ABUSE = 'QUESTION_1_ABUSE',
  CONTACT_COMFORT = 'CONTACT_COMFORT',
  QUESTION_3_AGREE = 'QUESTION_3_AGREE',
  QUESTION_4_HELP = 'QUESTION_4_HELP',
  QUESTION_5_MEDIATION = 'QUESTION_5_MEDIATION',
}

export default FormSteps;
EOF

# Create new userEvents.ts
echo "  - Creating new userEvents.ts..."
cat > server/constants/userEvents.ts << 'EOF'
export const userEvents = {
  START_SERVICE: 'start_service',
  COMPLETE_QUESTION_1: 'complete_question_1',
  COMPLETE_QUESTION_2: 'complete_question_2',
  COMPLETE_QUESTION_3: 'complete_question_3',
  COMPLETE_QUESTION_4: 'complete_question_4',
  COMPLETE_QUESTION_5: 'complete_question_5',
  VIEW_COURT: 'view_court',
  VIEW_MEDIATION: 'view_mediation',
  VIEW_PARENTING_PLAN: 'view_parenting_plan',
  VIEW_SAFEGUARDING: 'view_safeguarding',
  VIEW_NO_CONTACT: 'view_no_contact',
};
EOF

# Create new session types
echo "  - Creating new session types..."
cat > server/@types/session.d.ts << 'EOF'
import 'express-session';

export interface CSSession {
  // Question answers
  abuse?: 'yes' | 'no';
  contact?: 'yes' | 'no' | 'no-details' | 'no-response';
  agree?: 'yes' | 'not-discussed' | 'no';
  help?: 'plan' | 'external' | 'cannot';
  mediation?: 'yes' | 'no';

  // Flow tracking
  completedSteps?: string[];
}

declare module 'express-session' {
  interface SessionData extends CSSession {
    returnTo?: string;
  }
}
EOF

# Create flowConfig.ts
echo "  - Creating new flowConfig.ts..."
cat > server/config/flowConfig.ts << 'EOF'
import FormSteps from '../constants/formSteps';
import paths from '../constants/paths';

interface FlowStep {
  path: string;
  dependsOn?: FormSteps[];
}

export const flowConfig: Record<FormSteps, FlowStep> = {
  [FormSteps.START]: {
    path: paths.START,
  },
  [FormSteps.QUESTION_1_ABUSE]: {
    path: paths.QUESTION_1_ABUSE,
    dependsOn: [FormSteps.START],
  },
  [FormSteps.CONTACT_COMFORT]: {
    path: paths.CONTACT_COMFORT,
    dependsOn: [FormSteps.QUESTION_1_ABUSE],
  },
  [FormSteps.QUESTION_3_AGREE]: {
    path: paths.QUESTION_3_AGREE,
    dependsOn: [FormSteps.CONTACT_COMFORT],
  },
  [FormSteps.QUESTION_4_HELP]: {
    path: paths.QUESTION_4_HELP,
    dependsOn: [FormSteps.QUESTION_3_AGREE],
  },
  [FormSteps.QUESTION_5_MEDIATION]: {
    path: paths.QUESTION_5_MEDIATION,
    dependsOn: [FormSteps.QUESTION_4_HELP],
  },
};

export default flowConfig;
EOF

echo ""
echo -e "${GREEN}Step 4: Copying beta-1 templates from prototype${NC}"

# Create pages directory structure
mkdir -p server/views/pages

# Copy and convert beta-1 templates
PROTOTYPE_VIEWS="$SOURCE_DIR/$PROTOTYPE_DIR/app/views/beta-1"

# Function to convert prototype template to CAP format
convert_template() {
    local src="$1"
    local dest="$2"
    local filename=$(basename "$src" .html)

    # Read the file and convert
    cat "$src" | \
        # Change extends to use CAP layout
        sed 's|{% extends "layouts/main.html" %}|{% extends "partials/layout.njk" %}|g' | \
        # Update form actions to remove /beta-1/ prefix
        sed 's|action="/beta-1/|action="/|g' | \
        # Update redirects (these will be in route files, but just in case)
        sed 's|href="/beta-1/|href="/|g' | \
        # Update page title block
        sed 's|{{ serviceName }}|{{ __("serviceName") }}|g' | \
        # Add title variable for layout
        sed 's|{% block pageTitle %}|{% set title = __("pages.'"$filename"'.title") %}\n{% block pageTitle %}|' \
        > "$dest"

    echo "    Converted: $filename"
}

echo "  - Converting question pages..."
for i in 1 2 3 4 5; do
    if [ -f "$PROTOTYPE_VIEWS/question-$i.html" ]; then
        convert_template "$PROTOTYPE_VIEWS/question-$i.html" "server/views/pages/question-$i.njk"
    fi
done

echo "  - Converting outcome pages..."
for page in court mediation parenting-plan safeguarding no-contact; do
    if [ -f "$PROTOTYPE_VIEWS/$page.html" ]; then
        convert_template "$PROTOTYPE_VIEWS/$page.html" "server/views/pages/$page.njk"
    fi
done

echo "  - Converting information pages..."
for page in start guide steps compare service-finder stories; do
    if [ -f "$PROTOTYPE_VIEWS/$page.html" ]; then
        convert_template "$PROTOTYPE_VIEWS/$page.html" "server/views/pages/$page.njk"
    fi
done

echo ""
echo -e "${GREEN}Step 5: Creating route files${NC}"

# Create main routes index
echo "  - Creating routes/index.ts..."
cat > server/routes/index.ts << 'EOF'
import { Router } from 'express';
import questionRoutes from './questions';
import outcomeRoutes from './outcomes';
import informationRoutes from './information';

const router = Router();

// Question flow routes
router.use(questionRoutes);

// Outcome page routes
router.use(outcomeRoutes);

// Information page routes
router.use(informationRoutes);

export default router;
EOF

# Create question routes
echo "  - Creating routes/questions.ts..."
cat > server/routes/questions.ts << 'EOF'
import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import paths from '../constants/paths';

const router = Router();

// Question 1: Abuse
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

    if (req.body.abuse === 'yes') {
      return res.redirect(paths.SAFEGUARDING);
    }
    return res.redirect(paths.CONTACT_COMFORT);
  }
);

// Question 2: Contact
router.get(paths.CONTACT_COMFORT, (req: Request, res: Response) => {
  const errors = req.flash('errors');
  res.render('pages/contact-comfort', {
    title: res.__('pages.contactComfort.title'),
    backLinkHref: paths.QUESTION_1_ABUSE,
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
      req.flash('errors', errors.array() as any);
      return res.redirect(paths.CONTACT_COMFORT);
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
    title: res.__('pages.agreement.title'),
    backLinkHref: paths.CONTACT_COMFORT,
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
    title: res.__('pages.helpOptions.title'),
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
    title: res.__('pages.mediationCheck.title'),
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
EOF

# Create outcome routes
echo "  - Creating routes/outcomes.ts..."
cat > server/routes/outcomes.ts << 'EOF'
import { Router, Request, Response } from 'express';
import paths from '../constants/paths';

const router = Router();

router.get(paths.COURT, (req: Request, res: Response) => {
  res.render('pages/court', {
    title: res.__('pages.court.title'),
    backLinkHref: req.headers.referer || paths.START,
  });
});

router.get(paths.MEDIATION, (req: Request, res: Response) => {
  res.render('pages/mediation', {
    title: res.__('pages.mediation.title'),
    backLinkHref: paths.QUESTION_5_MEDIATION,
  });
});

router.get(paths.PARENTING_PLAN, (req: Request, res: Response) => {
  res.render('pages/parenting-plan', {
    title: res.__('pages.parentingPlan.title'),
    backLinkHref: req.headers.referer || paths.START,
  });
});

router.get(paths.SAFEGUARDING, (req: Request, res: Response) => {
  res.render('pages/safeguarding', {
    title: res.__('pages.safeguarding.title'),
    backLinkHref: paths.QUESTION_1_ABUSE,
  });
});

router.get(paths.NO_CONTACT, (req: Request, res: Response) => {
  res.render('pages/no-contact', {
    title: res.__('pages.noContact.title'),
    backLinkHref: paths.CONTACT_COMFORT,
  });
});

export default router;
EOF

# Create information routes
echo "  - Creating routes/information.ts..."
cat > server/routes/information.ts << 'EOF'
import { Router, Request, Response } from 'express';
import paths from '../constants/paths';

const router = Router();

router.get(paths.GUIDE, (req: Request, res: Response) => {
  res.render('pages/guide', {
    title: res.__('pages.guide.title'),
    backLinkHref: paths.START,
  });
});

router.get(paths.STEPS, (req: Request, res: Response) => {
  res.render('pages/steps', {
    title: res.__('pages.steps.title'),
    backLinkHref: paths.START,
  });
});

router.get(paths.COMPARE, (req: Request, res: Response) => {
  res.render('pages/compare', {
    title: res.__('pages.compare.title'),
    backLinkHref: paths.START,
  });
});

router.get(paths.SERVICE_FINDER, (req: Request, res: Response) => {
  res.render('pages/service-finder', {
    title: res.__('pages.serviceFinder.title'),
    backLinkHref: paths.START,
  });
});

export default router;
EOF

# Create start page route (update unauthenticatedRoutes or create new)
echo "  - Creating routes/start.ts..."
cat > server/routes/start.ts << 'EOF'
import { Router, Request, Response } from 'express';
import paths from '../constants/paths';

const router = Router();

router.get(paths.START, (req: Request, res: Response) => {
  // Clear session on start
  req.session.abuse = undefined;
  req.session.contact = undefined;
  req.session.agree = undefined;
  req.session.help = undefined;
  req.session.mediation = undefined;

  res.render('pages/start', {
    title: res.__('pages.start.title'),
  });
});

export default router;
EOF

echo ""
echo -e "${GREEN}Step 6: Creating locale files${NC}"

# Create English locale
echo "  - Creating en.json..."
cat > server/locales/en.json << 'EOF'
{
  "serviceName": "Get help making child arrangements",
  "back": "Back",
  "continue": "Continue",
  "phaseBannerText": "This is a new service – your <a class=\"govuk-link\" href=\"{feedbackUrl}\">feedback</a> will help us to improve it.",
  "footer": {
    "accessibility": "Accessibility statement",
    "contact": "Contact us",
    "cookies": "Cookies",
    "feedback": "Feedback",
    "privacy": "Privacy notice",
    "termsAndConditions": "Terms and conditions"
  },
  "pages": {
    "start": {
      "title": "Get help making child arrangements"
    },
    "question1": {
      "title": "Safety question"
    },
    "contactComfort": {
      "title": "Contact question"
    },
    "agreement": {
      "title": "Agreement question"
    },
    "helpOptions": {
      "title": "Help preference"
    },
    "mediationCheck": {
      "title": "Mediation question"
    },
    "court": {
      "title": "Going to court"
    },
    "mediation": {
      "title": "Mediation"
    },
    "parentingPlan": {
      "title": "Parenting plan"
    },
    "safeguarding": {
      "title": "Safety information"
    },
    "noContact": {
      "title": "Unable to contact"
    },
    "guide": {
      "title": "Guide"
    },
    "steps": {
      "title": "Steps"
    },
    "compare": {
      "title": "Compare options"
    },
    "serviceFinder": {
      "title": "Find services"
    }
  },
  "errors": {
    "selectOption": "Select an option"
  }
}
EOF

# Create Welsh locale (placeholder)
echo "  - Creating cy.json (placeholder)..."
cat > server/locales/cy.json << 'EOF'
{
  "serviceName": "Cael help i wneud trefniadau plant",
  "back": "Yn ôl",
  "continue": "Parhau"
}
EOF

echo ""
echo -e "${GREEN}Step 7: Updating package.json${NC}"

# Update package.json
cat > package.json << 'EOF'
{
  "name": "pfl-connecting-services",
  "version": "0.0.1",
  "description": "PFL Connecting Services - Help making child arrangements",
  "repository": "git@ssh.dev.azure.com:v3/ACE-C514/pfl-connecting-services/pfl-connecting-services",
  "license": "MIT",
  "scripts": {
    "build": "node esbuild/esbuild.config.mjs --build",
    "start": "node $ENV_FILE_OPTION $NODE_OPTIONS dist/app.js | bunyan -o short",
    "start:dev": "ENV_FILE_OPTION='--env-file=.env' nodemon --exec 'npm run build && npm run start'",
    "lint": "eslint . --cache --max-warnings 0",
    "lint:fix": "eslint . --cache --max-warnings 0 --fix",
    "prettier": "prettier . --cache --check",
    "prettier:fix": "prettier . --cache --write",
    "typecheck": "tsc && tsc -p e2e-tests",
    "test": "DOTENV_CONFIG_PATH='.env.test' jest",
    "test:ci": "DOTENV_CONFIG_PATH='.env.test' jest --runInBand --coverage",
    "e2e": "playwright test",
    "e2e:ui": "playwright test --ui",
    "e2e:headed": "playwright test --headed",
    "e2e:debug": "playwright test --debug"
  },
  "engines": {
    "node": "^22",
    "npm": "^11.0.0"
  },
  "dependencies": {
    "bunyan": "1.8.15",
    "bunyan-format": "0.2.1",
    "compression": "1.8.1",
    "connect-flash": "0.1.1",
    "connect-redis": "8.0.2",
    "cookie-parser": "1.4.7",
    "csrf-sync": "4.1.0",
    "express": "4.22.1",
    "express-rate-limit": "^7.5.0",
    "express-session": "1.18.2",
    "express-validator": "^7.3.1",
    "govuk-frontend": "5.13.0",
    "helmet": "8.1.0",
    "http-errors": "2.0.0",
    "i18n": "0.15.3",
    "nocache": "4.0.0",
    "nunjucks": "3.2.4",
    "on-finished": "^2.4.1",
    "rate-limit-redis": "^4.2.1",
    "redis": "4.7.0"
  },
  "devDependencies": {
    "@eslint/js": "9.28.0",
    "@jgoz/esbuild-plugin-typecheck": "4.0.3",
    "@playwright/test": "^1.49.1",
    "@testing-library/jest-dom": "6.6.3",
    "@tsconfig/node22": "22.0.2",
    "@types/bunyan": "1.8.11",
    "@types/bunyan-format": "0.2.9",
    "@types/compression": "1.8.1",
    "@types/connect-flash": "0.0.40",
    "@types/cookie-parser": "1.4.9",
    "@types/express-session": "1.18.2",
    "@types/http-errors": "2.0.5",
    "@types/i18n": "0.13.12",
    "@types/jest": "29.5.14",
    "@types/jsdom": "21.1.7",
    "@types/node": "22.15.30",
    "@types/nunjucks": "3.2.6",
    "@types/on-finished": "^2.3.5",
    "@types/supertest": "6.0.3",
    "@typescript-eslint/eslint-plugin": "8.34.0",
    "@typescript-eslint/parser": "8.34.0",
    "dotenv": "16.5.0",
    "dotenv-cli": "8.0.0",
    "esbuild": "0.25.5",
    "esbuild-plugin-clean": "1.0.1",
    "esbuild-plugin-copy": "2.1.1",
    "esbuild-plugin-manifest": "1.0.5",
    "esbuild-sass-plugin": "3.3.1",
    "eslint": "9.28.0",
    "eslint-config-prettier": "10.1.5",
    "eslint-import-resolver-typescript": "4.4.3",
    "eslint-plugin-import": "2.31.0",
    "eslint-plugin-jest": "28.13.3",
    "eslint-plugin-jest-dom": "5.5.0",
    "eslint-plugin-no-only-tests": "3.3.0",
    "eslint-plugin-unused-imports": "4.1.4",
    "glob": "^12.0.0",
    "globals": "16.2.0",
    "jest": "29.7.0",
    "jest-html-reporter": "4.1.0",
    "jest-junit": "16.0.0",
    "jsdom": "26.1.0",
    "nodemon": "3.1.10",
    "prettier": "3.5.3",
    "prettier-plugin-jinja-template": "2.1.0",
    "start-server-and-test": "2.0.12",
    "supertest": "7.1.1",
    "ts-jest": "29.3.4",
    "typescript": "5.8.3",
    "typescript-eslint": "8.34.0"
  }
}
EOF

echo ""
echo -e "${GREEN}Step 8: Updating configuration files${NC}"

# Update .env.example
echo "  - Updating .env.example..."
cat > .env.example << 'EOF'
NODE_ENV=development
PORT=3000
USE_AUTH=false
SESSION_SECRET=your-session-secret-here
PASSWORD=your-password-here
CACHE_ENABLED=false
GA4_ID=
FEEDBACK_URL=https://example.com/feedback
EOF

# Create a basic .env for local development
echo "  - Creating .env for local development..."
cat > .env << 'EOF'
NODE_ENV=development
PORT=3000
USE_AUTH=false
SESSION_SECRET=local-dev-secret-change-in-production
PASSWORD=password
CACHE_ENABLED=false
FEEDBACK_URL=https://example.com/feedback
EOF

echo ""
echo -e "${GREEN}Step 9: Cleaning up${NC}"

# Remove CAP-specific GitHub workflow references (keep structure)
echo "  - Updating GitHub workflows..."
if [ -f ".github/workflows/build-push-image.yml" ]; then
    sed -i '' 's/care-arrangement-plan/connecting-services/g' .github/workflows/build-push-image.yml 2>/dev/null || true
fi

# Remove postbuild script reference (no PDF generation)
echo "  - Removing PDF generation from build..."

# Initialize git
echo "  - Initializing git repository..."
git init
git add .
git commit -m "Initial commit: Connecting Services app from CAP template"

echo ""
echo -e "${GREEN}=== Setup Complete ===${NC}"
echo ""
echo "The Connecting Services app has been created at: $TARGET_DIR"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. cd $TARGET_DIR"
echo "2. npm install"
echo "3. Review and update the converted templates in server/views/pages/"
echo "4. Update server/routes/index.ts to import routes correctly in app.ts"
echo "5. Review server/locales/en.json for correct copy"
echo "6. npm run start:dev"
echo ""
echo -e "${YELLOW}Manual tasks required:${NC}"
echo "- Update server/routes/index.ts imports in the main app.ts file"
echo "- Review converted Nunjucks templates for any remaining prototype-kit syntax"
echo "- Add Welsh translations to server/locales/cy.json"
echo "- Update deployment configs in deploy/ directory"
echo "- Set up new Azure DevOps pipeline"
echo ""
