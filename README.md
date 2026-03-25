<div align="center">


# <img alt="MoJ logo" src="https://moj-logos.s3.eu-west-2.amazonaws.com/moj-uk-logo.png" width="200"><br>PFL Connecting Services

[![Standards Icon]][Standards Link]
[![License Icon]][License Link]

</div>

<br>
<br>

# PFL Connecting Services

A Node.js application built with Express and TypeScript that helps users navigate child arrangement processes. The application uses the GOV.UK Design System for consistent user experience and supports both English and Welsh languages.

## Open beta

To move the service into an open beta, the following changes should be made

- Remove the password page and authentication middleware
- Remove the service no longer available middleware

## Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
  - [Basic Configuration](#basic-configuration)
  - [Session Management](#session-management)
  - [Redis Cache](#redis-cache)
  - [Application Features](#application-features)
  - [Logging and Security](#logging-and-security)
- [Running the Application](#running-the-application)
  - [Development Mode](#development-mode)
  - [Production Build](#production-build)
  - [Running with Redis Cache](#running-with-redis-cache)
  - [Running in Docker](#running-in-docker)
- [Testing](#testing)
  - [Unit Tests](#unit-tests)
  - [End-to-End Tests](#end-to-end-tests)
  - [Static Analysis](#static-analysis)
- [Project Structure](#project-structure)
- [Language Support](#language-support)
- [API Routes](#api-routes)
  - [Authenticated Routes](#authenticated-routes)
  - [Public Routes](#public-routes)
  - [System Routes](#system-routes)
- [Development Workflow](#development-workflow)
  - [Pre-commit Hooks](#pre-commit-hooks)
  - [Code Quality](#code-quality)
  - [Branching Strategy](#branching-strategy)
  - [Pull Request Process](#pull-request-process)
- [Deployment](#deployment)
  - [Environments](#environments)
  - [Infrastructure](#infrastructure)
  - [CI and CD Pipelines](#ci-and-cd-pipelines)
- [Analytics](#analytics)
- [Troubleshooting](#troubleshooting)
  - [Common Issues](#common-issues)
  - [Debug Mode](#debug-mode)
  - [Health Checks](#health-checks)
- [Contributing](#contributing)
  - [Code Standards](#code-standards)
  - [Commit Guidelines](#commit-guidelines)
  - [Adding New Features](#adding-new-features)
  - [Adding New Routes](#adding-new-routes)
- [License](#license)
- [Architecture](#architecture)
- [Deployment and Infrastructure details](#deployment-and-infrastructure-details)
- [Language Support](#language-support)
- [Tests](#tests)
- [Static Checks](#static-checks)
- [E2E Tests](#e2e-tests)
- [Common tasks](#common-tasks)
  - [Adding a new question](#adding-a-new-question)
- [TODO](#todo)
- [Known issues](#known-issues)

## Features

- **Child Arrangement Guidance**: Step-by-step guidance for making child arrangements including parenting plans, mediation, and court orders
- **Multilingual Support**: Full English and Welsh language support with locale-based content management
- **Secure Sessions**: Redis-backed session management with configurable timeouts and secure cookie handling
- **Accessibility**: Built with accessibility best practices using GOV.UK Frontend, including WCAG 2.1 compliance
- **Comprehensive Testing**: Unit tests with Jest, E2E tests with Playwright across multiple browsers
- **Security Features**: CSRF protection, rate limiting, helmet security headers, and input validation
- **Analytics Integration**: GA4 analytics with cookie consent management
- **Docker Support**: Full containerization with multi-stage builds for development and production
- **Health Monitoring**: Application health checks and structured logging with Bunyan

## Tech Stack

- **Runtime**: Node.js 22+ (LTS)
- **Framework**: Express.js 4.22+
- **Language**: TypeScript 5.8+
- **Templating**: Nunjucks 3.2+
- **Styling**: GOV.UK Frontend 5.14+
- **Build Tool**: ESBuild with custom plugins
- **Testing**: Jest 29+, Playwright 1.49+
- **Caching**: Redis 4.7+ (optional)
- **Containerization**: Docker with multi-stage builds
- **Development**: Nodemon, ESLint, Prettier
- **Security**: Helmet, CSRF-sync, express-rate-limit

## Prerequisites

- Node.js ^22.0.0
- npm ^11.0.0
- Docker Desktop 4.0+ (for local Redis cache and containerized development)
- Git

## Installation

1. **Clone the repository**:
   ```bash
   HTTPS: https://github.com/ministryofjustice/pfl-connecting-services.git
   GitHub CLI: gh repo clone ministryofjustice/pfl-connecting-services
   cd pfl-connecting-services
   ```

2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration values (see Environment Variables section below).

4. **Install Playwright browsers** (for E2E testing):
   ```bash
   npx playwright install
   ```

## Environment Variables

The application uses the following environment variables ([example file](https://github.com/ministryofjustice/pfl-connecting-services/blob/main/.env.example)):

### Basic Configuration
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (development/staging/production)
- `BUILD_NUMBER`: Application version identifier
- `GIT_REF`: Git commit hash for build tracking
- `USE_HTTPS`: Enable HTTPS in production (default: false)

### Session Management
- `SESSION_SECRET`: Secret key for session cookies (MUST be changed in production)
- `WEB_SESSION_TIMEOUT_IN_MINUTES`: Session timeout duration (default: 30)

### Redis Cache
- `CACHE_ENABLED`: Enable Redis caching (default: false)
- `CACHE_HOST`: Redis server hostname (default: localhost)
- `CACHE_PASSWORD`: Redis authentication password
- `CACHE_TLS_ENABLED`: Enable TLS for Redis connection

### Application Features
- `BETA_ACCESS_PASSWORDS`: Comma-separated passwords for early access
- `USE_AUTH`: Enable authentication middleware (default: true)
- `INCLUDE_WELSH_LANGUAGE`: Enable Welsh language support (default: true)
- `FEEDBACK_URL`: URL for user feedback form
- `CONTACT_EMAIL`: Support/admin email address
- `PREVIEW_END`: ISO timestamp for preview period end

### Logging & Security
- `LOG_LEVEL`: Logging verbosity (debug/info/warn/error)
- `HASH_SECRET`: Secret for generating secure hashes
- `GA4_ID`: Google Analytics 4 measurement ID (optional)

## Running the Application

### Development Mode

Start the application with hot reloading and development features:
```bash
npm run start:dev
```

The application will be available at `http://localhost:3000` with:
- Hot reloading enabled via Nodemon
- Development logging with Bunyan short format
- File watching for automatic restarts

### Production Build

Build the application for production:
```bash
npm run build
npm start
```

The build process:
1. Type-checks TypeScript code
2. Bundles assets with ESBuild
3. Optimizes static resources
4. Generates production-ready files in `dist/`

### Running with Redis Cache

For distributed session caching (recommended for production-like environments):

1. **Start Redis**:
   ```bash
   docker compose up -d
   ```

2. **Configure environment**:
   ```bash
   # In .env file
   CACHE_ENABLED=true
   CACHE_PASSWORD=cache_password
   ```

3. **Start the application**:
   ```bash
   npm run start:dev
   ```

### Running in Docker

Run the full application stack in Docker for consistent development environments:

```bash
# Start development environment with hot reloading
docker compose --profile dev up

# Run tests in container
docker compose exec -e NODE_ENV=test app npm run test

# View logs
docker compose logs -f app
```

## Testing

### Unit Tests

Run Jest unit tests with coverage:
```bash
# Run all tests
npm test

# Run with coverage report
npm run test:ci

# Run specific test file
npm test -- server/routes/agreement.test.ts

# Update PDF snapshots (for visual regression tests)
UPDATE_PDF_SNAPSHOTS=true npm test
```

Test configuration:
- Uses jsdom for DOM simulation
- Includes coverage reporting
- Supports PDF snapshot testing
- Runs in CI with parallel execution

### End-to-End Tests

Run Playwright E2E tests across multiple browsers:
```bash
# Run all E2E tests (headless)
npm run e2e

# Run with interactive UI
npm run e2e:ui

# Run in headed mode (visible browser)
npm run e2e:headed

# Debug specific test
npm run e2e:debug

# Run accessibility tests
npm run e2e -- --grep "accessibility"
```

E2E test coverage includes:
- User journey flows (agreement → mediation → parenting plan)
- Accessibility compliance (WCAG 2.1)
- Cross-browser compatibility (Chromium, Firefox, WebKit)
- Mobile responsiveness
- Cookie consent and analytics
- Error handling and edge cases

### Static Analysis

```bash
# Type checking
npm run typecheck

# Linting
npm run lint
npm run lint:fix  # Auto-fix issues

# Code formatting
npm run prettier
npm run prettier:fix  # Auto-format code
```

Quality gates:
- Zero ESLint warnings/errors
- TypeScript compilation passes
- Prettier formatting enforced
- Pre-commit hooks validate all checks

## Project Structure

The main app code lives in the `server` directory, where it is separated into folders based on functionality. Tests should
be at the same level as the file they test, and names `<<file>>.test.ts`.

End to end tests are in the `e2e-tests` directory. Test files should have the name `<<file>>.spec.ts`.

```
├── server/                          # Main application code
│   ├── @types/                      # TypeScript type definitions
│   ├── routes/                      # Express route handlers
│   │   ├── agreement.ts            # Agreement page routes
│   │   ├── childSafety.ts          # Child safety routes
│   │   ├── mediation.ts            # Mediation service routes
│   │   ├── parentingPlan.ts        # Parenting plan routes
│   │   └── ...                     # Other feature routes
│   ├── services/                    # Business logic services
│   ├── views/                       # Nunjucks templates
│   │   ├── agreement/              # Agreement page templates
│   │   ├── child-safety/           # Child safety templates
│   │   └── ...                     # Other page templates
│   ├── locales/                     # Translation files
│   │   ├── en.json                 # English translations
│   │   └── cy.json                 # Welsh translations
│   ├── middleware/                  # Express middleware
│   │   ├── auth.ts                 # Authentication middleware
│   │   ├── csrf.ts                 # CSRF protection
│   │   └── rateLimit.ts            # Rate limiting
│   ├── utils/                       # Utility functions
│   ├── config/                      # Configuration management
│   ├── constants/                   # Application constants
│   └── logging/                     # Logging configuration
├── e2e-tests/                       # End-to-end tests
│   ├── *.spec.ts                   # Playwright test files
│   ├── fixtures/                   # Test data and helpers
│   └── README.md                   # E2E testing guide
├── assets/                          # Static assets
│   ├── scss/                       # Sass stylesheets
│   ├── js/                         # Client-side JavaScript
│   └── fonts/                      # Font files
├── deploy/                          # Kubernetes deployment
│   ├── development/                # Dev environment configs
│   ├── staging/                    # Staging environment configs
│   ├── production/                 # Production environment configs
│   └── README.md                   # Infrastructure guide
├── architecture-docs/               # Architecture documentation
├── esbuild/                         # Build configuration
│   ├── esbuild.config.mjs          # Main build config
│   ├── app.config.mjs              # Application bundling
│   └── assets.config.mjs           # Asset processing
└── test-assets/                     # Test-specific assets
```

## Language Support

The application supports English and Welsh with comprehensive internationalization:

- **Locale Files**: All text content managed in `server/locales/en.json` and `server/locales/cy.json`
- **Template Usage**: Access translations with `{{ __('key.path') }}` in Nunjucks templates
- **Fallback**: English used as fallback when Welsh translations are missing
- **Feature Toggle**: Welsh support can be disabled with `INCLUDE_WELSH_LANGUAGE=false`
- **URL Routing**: Language selection affects URL paths and content

## API Routes

### Authenticated Routes
- `/agree` - Agreement and consent page
- `/child-safety` - Child safety information and guidance
- `/child-safety-help` - Additional child safety support
- `/contact-child-arrangements` - Contact arrangements guidance
- `/court-order` - Court order information
- `/domestic-abuse` - Domestic abuse safety guidance
- `/help-to-agree` - Help with reaching agreements
- `/mediation` - Mediation service information
- `/options-no-contact` - Options when no contact is appropriate
- `/other-options` - Alternative arrangement options
- `/parenting-plan` - Parenting plan creation guidance
- `/safeguarding` - Safeguarding and protection information

### Public Routes
- `/` - Homepage
- `/accessibility` - Accessibility statement
- `/contact-us` - Contact information
- `/cookies` - Cookie policy and preferences
- `/privacy-notice` - Privacy notice
- `/terms-conditions` - Terms and conditions
- `/password` - Beta access password entry

### System Routes
- `/health` - Application health check
- `/analytics` - Analytics tracking endpoints

## Development Workflow

### Pre-commit Hooks

The project uses Husky for Git hooks:
- **Pre-commit**: Runs linting and Playwright cross-browser validation
- **Pre-push**: Ensures all tests pass before pushing

### Code Quality

- **ESLint**: Configured with TypeScript and accessibility rules
- **Prettier**: Consistent code formatting
- **TypeScript**: Strict type checking enabled
- **Import Sorting**: Automatic import organization

### Branching Strategy

- `main`: Production-ready code
- Feature branches: `feature/description-of-feature`
- Hotfix branches: `hotfix/description-of-fix`

### Pull Request Process

1. Create feature branch from `main`
2. Implement changes with tests
3. Ensure all checks pass
4. Create PR with description
5. Code review and approval
6. Merge feature branch to `main`

## Deployment

### Environments

- **Development**: Latest code from `main` branch
- **Staging**: Pre-production testing environment
- **Production**: Live service environment

### Infrastructure

- **Platform**: MoJ Cloud Platform (Kubernetes)
- **Monitoring**: Grafana dashboards, Prometheus metrics
- **Logging**: Centralized logging with correlation IDs
- **Scaling**: Horizontal Pod Autoscaling based on CPU/memory
- **Security**: Network policies, secrets management

### CI and CD Pipelines

- **Build**: Automated builds on push to main/develop
- **Test**: Full test suite execution in CI
- **Security**: Dependency scanning and vulnerability checks
- **Deploy**: Automated deployment to environments
- **Monitoring**: Health checks and alerting

## Analytics

We used GA4 for tracking. GA4 will only be enabled if the environment variable `GA4_ID` exists.

If the user does not have a `cookie_policy` cookie, GA4 will not activate, and the cookie consent banner will load. Once
that cookie exists, tracking will be enabled depending on the consent setting within in.

GA4 analytics integration with privacy compliance:

- **Consent Management**: Cookie banner with user preferences
- **Event Tracking**: Page views, user journeys, form completions
- **Privacy**: Analytics disabled without user consent
- **Configuration**: Set `GA4_ID` environment variable to enable

## Troubleshooting

### Common Issues

**Application won't start**:
- Check Node.js version: `node --version` (should be 22+)
- Verify environment variables in `.env`
- Check port availability: `lsof -i :3000`

**Redis connection fails**:
- Ensure Docker is running: `docker ps`
- Check Redis password in `.env`
- Verify `CACHE_ENABLED=true`

**Tests failing**:
- Install Playwright browsers: `npx playwright install`
- Check test environment variables in `.env.test`
- Clear test cache: `npm test -- --clearCache`

**Build errors**:
- Clear node_modules: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run typecheck`
- Verify ESBuild configuration

### Debug Mode

Enable debug logging:
```bash
LOG_LEVEL=debug npm run start:dev
```

### Health Checks

Check application health:
```bash
curl http://localhost:3000/health
```

## Contributing

### Code Standards

1. **TypeScript**: Use strict typing, avoid `any` types
2. **Testing**: Write tests for all new features and bug fixes
3. **Accessibility**: Follow WCAG 2.1 guidelines
4. **Security**: Validate all inputs, use parameterized queries
5. **Performance**: Optimize bundle size and runtime performance

### Commit Guidelines

- Use conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`
- Keep commits focused and atomic
- Write clear commit messages

### Adding New Features

1. **Plan**: Create ADR in `architecture-docs/decisions/`
2. **Implement**: Follow existing patterns and conventions
3. **Test**: Add comprehensive unit and E2E tests
4. **Document**: Update README and inline documentation
5. **Review**: Submit PR with detailed description

### Adding New Routes

1. Create route file in `server/routes/`
2. Add corresponding test file
3. Update route index in `server/routes/index.ts`
4. Add Nunjucks templates in `server/views/`
5. Update locale files for new content
6. Add E2E tests for user flows

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Architecture

For detailed architecture documentation, see [architecture-docs/README.md](architecture-docs/README.md).

## Deployment and Infrastructure details

For deployment and infrastructure details, see [deploy/README.md](deploy/README.md).
```

The app will now connect to Redis when running.

### Running in Docker

You can run the app in a docker container, so more closely simulate the hosted environment. To use docker for development, run

```shell
docker compose --profile dev up
```

With the app running, run tests locally in Docker, with the command

```shell
docker compose exec -e NODE_ENV=test app npm run test
```

## Language Support

The app has support for English and Welsh. All text should be added to `server/locales`, instead of being added directly
to the Nunjucks template. If you have added an item `home.title` to the locales files, you can access it from the template:

```html
<h1>{{ __('home.title') }}</h1>
```

If there is no Welsh translation, the English value will be used as a fallback.

The Welsh support can be toggled on/off using the `INCLUDE_WELSH_LANGUAGE` environment variable, allowing us to do
releases before full Welsh translation is complete.

## Tests

We use [Jest](https://jestjs.io/) for unit tests. To run them run `npm run test`.

**Note**: The integration tests assume the authentication is switched in the config. The default setups use the `.env.test`
file, where this is the case, but if you are modifying things you will need to ensure this is still used.

These include PDF snapshot tests. To update the tests, run them with the environment variable `UPDATE_PDF_SNAPSHOTS=true`,
or run `npm run test:update-pdf-snapshots`

We also have end to end tests using [Playwright](https://playwright.dev/). To run these, start the app server then run
either `npm run e2e` for headless mode, or `npm run e2e:headed` for non-headless mode.

## Static Checks

To run the TypeScript compiler use `npm run typecheck`.

We use ESLint for linting. To run the check use `npm run lint`. `npm run lint:fix` can be used to automatically fix issues.

We use Prettier to ensure consistent styling. Run `npm run prettier` to check for issues, and `npm run prettier:fix` to fix them.

It is recommended to use your IDE to run ESLint and Prettier on save, to ensure files are formatted correctly.

## E2E Tests

We use [Playwright](https://playwright.dev/) for end-to-end tests. See the [Playwright quickstart guide](e2e-tests/PLAYWRIGHT_QUICKSTART.md) for a first-time walkthrough, or the [E2E tests README](e2e-tests/README.md) for full reference. To run them:

```shell
npm run e2e
```

Locally, tests run across all three browsers (Chromium, Firefox, WebKit). In CI, only Chromium is used for stability.

### Pre-commit hooks

[Husky](https://typicode.github.io/husky/) runs two checks before each commit:

- **Lint** — runs `npm run lint` and warns if there are issues
- **Playwright cross-browser check** — warns if `playwright-results.xml` is missing or does not include results for all three browsers

Neither check blocks the commit. The Playwright results file is automatically deleted after each commit, so you will be reminded to re-run the tests before your next commit.

## API Documentation

### Authenticated route list

- [Agreement](/agree)
- [Child safety](/child-safety)
- [Child safety help](/child-safety-help)
- [Contact child arrangements](/contact-child-arrangements)
- [Court order](/court-order)
- [Domestic abuse](/domestic-abuse)
- [Help to agree](/help-to-agree)
- [Mediation](/mediation)
- [Options no contact](/options-no-contact)
- [Other options](/other-options)
- [Parenting plan](/parenting-plan)
- [Safeguarding](/getting-help)

### Public route list

- [Accessiibility statement](/accessibility)
- [Contact us](/contact-us)
- [Cookies](/cookies)
- [Privacy notice](/privacy-notice)
- [Terms and conditions](/terms-conditions)

## Pipeline

We have two pipelines. One runs for pull requests, and prevents the merge unless the tests and static analysis are passing.
The second runs on merges to the `main` branch, and runs these tests, then releases the app to the development environment.
There is a manual step in this pipeline to release to production.

Secrets used in the deployment pipeline are stored as GitHub Actions secrets, and are saved per-environment.

## Common Tasks

### Adding a new question

There are a few steps to adding a new question

- Decide the data structure for the answers, and add it to the [`CSSession`](./server/@types/session.d.ts) type
- Create the pages and routes for the question
- Add the question to the task list
- Add the completion check to the question to the conditional that displays the "Continue" button on the task list
- Add the question's answers to the "Check your answers page" - this should be as close as possible to exactly what the
  user has entered

## TODO

- Sonar/some SAST tool
- Add alerts
- Add more end to end tests

## Known issues

- Prevent users from starting midway through the journey
  > We should prevent users from joining the service without a valid session.
  >
  > This should happen by redirecting them if they access any page other than the first without a valid session cookie.
  >
  > We should also consider use cases where the user has started the journey, but access a page they shouldn’t be able
  > to yet (e.g children’s names before number of children)


<!-- License -->

[License Link]: https://github.com/ministryofjustice/pfl-connecting-services/blob/main/LICENSE 'License.'
[License Icon]: https://img.shields.io/github/license/ministryofjustice/pfl-connecting-services?style=for-the-badge

<!-- MoJ Standards -->

[Standards Link]: https://operations-engineering-reports.cloud-platform.service.justice.gov.uk/public-report/connecting-services 'Repo standards badge.'
[Standards Icon]: https://img.shields.io/endpoint?labelColor=231f20&color=005ea5&style=for-the-badge&url=https%3A%2F%2Foperations-engineering-reports.cloud-platform.service.justice.gov.uk%2Fapi%2Fv1%2Fcompliant_public_repositories%2Fendpoint%2Fpfl-connecting-services&logo=data:image/png;base64,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