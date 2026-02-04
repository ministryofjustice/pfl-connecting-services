# E2E Tests

End-to-end tests for the Connecting Services application using Playwright.

## Quick Start

```bash
# Run all tests
npm run e2e

# Run tests with UI (recommended for development)
npm run e2e:ui

# Run tests in headed mode
npm run e2e:headed

# Debug a specific test
npm run e2e:debug
```

## Test Files

- `health.spec.ts` - API health check tests
- `homepage.spec.ts` - Homepage functionality tests
- `accessibility.spec.ts` - Accessibility compliance tests
- `static-pages.spec.ts` - Static pages (cookies, privacy, etc.)
- `session-persistence.spec.ts` - Session management tests
- `agreement.spec.ts` - Agreement question tests
- `options-no-contact.spec.ts` - Options no contact page tests

## Fixtures

### Test Helpers (`fixtures/test-helpers.ts`)

Utility functions for navigating through the form flow:
- `startJourney()` - Start from homepage
- `navigateToDomesticAbuse()` - Navigate to domestic abuse page
- `navigateToContactComfort()` - Navigate to contact comfort page
- `navigateToAgreement()` - Navigate to agreement page
- `navigateToHelpOptions()` - Navigate to help options page
- `navigateToMediationCheck()` - Navigate to mediation check page
- `navigateToOptionsNoContact()` - Navigate to options no contact page

### Navigation Helpers (`fixtures/navigation-helpers.ts`)

Helpers for testing navigation:
- `verifyBackNavigation()` - Test browser back button
- `verifyServiceBackLink()` - Test GOV.UK back link
- `verifyForwardNavigation()` - Test browser forward button

## Writing Tests

### Basic Test

```typescript
import { test, expect } from '@playwright/test';

test('my test', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
});
```

### Using Helpers

```typescript
import { navigateToAgreement } from './fixtures/test-helpers';

test('agreement test', async ({ page }) => {
  await navigateToAgreement(page);
  // Test continues from agreement page
});
```

## Best Practices

1. Use descriptive test names
2. Follow Arrange-Act-Assert pattern
3. Use helper functions to navigate through form flow
4. Keep tests independent
5. Use role-based selectors when possible
6. Avoid hard waits
