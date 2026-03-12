import { test, expect } from '@playwright/test';

import { verifyBackNavigation, verifyForwardNavigation } from './fixtures/navigation-helpers';
import { contactChildArrangementOption, agreeOnChildArrangementOption, helpToAgreeOnChildArrangementOption, otherOptions, staticPages } from './fixtures/test-data';
import { startJourney, selectDomesticAbuseOption, selectContactChildArrangementsOption, selectAgreeOnChildArrangementsOption, selectHelpToAgreeOnChildArrangementsOption, selectOtherOptions } from './fixtures/test-helpers';

test.describe('Browser Navigation and Data persistence between pages', () => {
   test('should navigate back from domestic abuse page to homepage', async ({ page }) => {
    await startJourney(page);

    await verifyBackNavigation(page, '/');

    await expect(page.getByRole('button', { name: /start now/i })).toBeVisible();
  });

   test('should navigate back from getting help page to domestic abuse page, with data persisting', async ({ page }) => {
    await startJourney(page);

    await selectDomesticAbuseOption(page, 'Yes')
    await expect(page).toHaveURL(/getting-help/);

    await verifyBackNavigation(page, /domestic-abuse/, 
      async () => {
        await expect(page.getByLabel(/yes/i)).toBeChecked();
      }
    );

    // Verify we can proceed forward
    await page.getByRole('button', { name: /continue/i }).click();
    await expect(page).toHaveURL(/getting-help/);
  });

  test('should navigate back from contact child arrangements to domestic abuse page, with data persisting ', async ({ page }) => {
    await startJourney(page);

    await selectDomesticAbuseOption(page, 'No')
    await expect(page).toHaveURL(/contact-child-arrangements/);

    await verifyBackNavigation(page, /domestic-abuse/, 
      async () => {
       await expect(page.getByLabel(/no/i)).toBeChecked();
      }
    );

    await page.getByRole('button', { name: /continue/i }).click();
    await expect(page).toHaveURL(/contact-child-arrangements/);
  });

   test('should navigate back from contact child arrangements to getting help, with data persisting ', async ({ page }) => {
    await startJourney(page);

    await selectDomesticAbuseOption(page, 'Yes')
    await page.getByRole('button', { name: /continue/i }).click();
    await expect(page).toHaveURL(/contact-child-arrangements/);

    await verifyBackNavigation(page, /getting-help/, 
      async () => {
       await expect(page.getByRole('button', { name: /continue/i })).toBeVisible();
      }
    );

    await page.getByRole('button', { name: /continue/i }).click();
    await expect(page).toHaveURL(/contact-child-arrangements/);
  });

  for (const { label, nextUrl } of contactChildArrangementOption) {
  test(`should navigate back from varying pages to contact child arrangements, with chosen "${label}" being checked`, async ({ page }) => {
    await startJourney(page);
    await selectDomesticAbuseOption(page, 'No');

    await page.getByLabel(label).check();
    await page.getByRole('button', { name: /continue/i }).click();
    await expect(page).toHaveURL(nextUrl);

    await verifyBackNavigation(page, /contact-child-arrangements/, async () => {
      await expect(page.getByLabel(label)).toBeChecked();
    });

    await page.getByRole('button', { name: /continue/i }).click();
    await expect(page).toHaveURL(nextUrl);
  });
  }

  for (const { label, nextUrl } of agreeOnChildArrangementOption) {
  test(`should navigate back from varying pages to agree om child arrangements, with chosen "${label}" being checked`, async ({ page }) => {
    await startJourney(page);
    await selectDomesticAbuseOption(page, 'No');
    await selectContactChildArrangementsOption(page, 'Yes')

    await page.getByLabel(label).check();
    await page.getByRole('button', { name: /continue/i }).click();
    await expect(page).toHaveURL(nextUrl);

    await verifyBackNavigation(page, /agree/, async () => {
      await expect(page.getByLabel(label)).toBeChecked();
    });

    await page.getByRole('button', { name: /continue/i }).click();
    await expect(page).toHaveURL(nextUrl);
  });
  }

  for (const { label, nextUrl } of helpToAgreeOnChildArrangementOption) {
  test(`should navigate back from varying pages to help to agree on child arrangements, with chosen "${label}" being checked`, async ({ page }) => {
    await startJourney(page);
    await selectDomesticAbuseOption(page, 'No');
    await selectContactChildArrangementsOption(page, 'Yes')
    await selectAgreeOnChildArrangementsOption(page, 'No, we do not agree')

    await page.getByLabel(label).check();
    await page.getByRole('button', { name: /continue/i }).click();
    await expect(page).toHaveURL(nextUrl);

    await verifyBackNavigation(page, /help-to-agree/, async () => {
      await expect(page.getByLabel(label)).toBeChecked();
    });

    await page.getByRole('button', { name: /continue/i }).click();
    await expect(page).toHaveURL(nextUrl);
  });
  }
  
  for (const { label, nextUrl } of otherOptions) {
  test(`should navigate back from varying pages to help to other options, with chosen "${label}" being checked`, async ({ page }) => {
    await startJourney(page);
    await selectDomesticAbuseOption(page, 'No');
    await selectContactChildArrangementsOption(page, 'Yes')
    await selectAgreeOnChildArrangementsOption(page, 'No, we do not agree')
    await selectHelpToAgreeOnChildArrangementsOption(page, 'Someone else to guide our conversations')

    await page.getByLabel(label).check();
    await page.getByRole('button', { name: /continue/i }).click();
    await expect(page).toHaveURL(nextUrl);

    await verifyBackNavigation(page, /other-options/, async () => {
      await expect(page.getByLabel(label)).toBeChecked();
    });

    await page.getByRole('button', { name: /continue/i }).click();
    await expect(page).toHaveURL(nextUrl);
  });
  }
});

test.describe('Browser Navigation - Multiple Forward and Backward Navigation', () => {
  test(`should navigate back form the furthest page: mediation, to the domestic abuse page and then forward, with data persisting`, async ({ page }) => {
    await startJourney(page);
    await selectDomesticAbuseOption(page, 'Yes');
    await page.getByRole('button', { name: /continue/i }).click();
    await selectContactChildArrangementsOption(page, 'Yes')
    await selectAgreeOnChildArrangementsOption(page, 'No, we do not agree')
    await selectHelpToAgreeOnChildArrangementsOption(page, 'Someone else to guide our conversations')
    await selectOtherOptions(page, 'No, we have not tried yet')

    // Go Back
    await verifyBackNavigation(page, /other-options/, async () => {
      await expect(page.getByLabel("No, we have not tried yet")).toBeChecked();
    });
    await verifyBackNavigation(page, /help-to-agree/, async () => {
      await expect(page.getByLabel("Someone else to guide our conversations")).toBeChecked();
    });
    await verifyBackNavigation(page, /agree/, async () => {
      await expect(page.getByLabel("No, we do not agree")).toBeChecked();
    });
     await verifyBackNavigation(page, /contact-child-arrangements/, async () => {
      await expect(page.getByLabel("Yes")).toBeChecked();
    });
     await verifyBackNavigation(page, /getting-help/, async () => {
       await expect(page.getByRole('button', { name: /continue/i })).toBeVisible();
    });
     await verifyBackNavigation(page, /domestic-abuse/, async () => {
      await expect(page.getByLabel("Yes")).toBeChecked();
    });

    // Go Forward
    await verifyForwardNavigation(page, /getting-help/, async () => {
       await expect(page.getByRole('button', { name: /continue/i })).toBeVisible();
    });
    await verifyForwardNavigation(page, /contact-child-arrangements/, async () => {
      await expect(page.getByLabel("Yes")).toBeChecked();
    });
    await verifyForwardNavigation(page, /agree/, async () => {
      await expect(page.getByLabel("No, we do not agree")).toBeChecked();
    });
    await verifyForwardNavigation(page, /help-to-agree/, async () => {
      await expect(page.getByLabel("Someone else to guide our conversations")).toBeChecked();
    });
    await verifyForwardNavigation(page, /other-options/, async () => {
      await expect(page.getByLabel("No, we have not tried yet")).toBeChecked();
    });
    await verifyForwardNavigation(page, /mediation/);
  });
});

test.describe('Browser Navigation - Error Messages', () => {
  test('should handle validation error page navigation using browser back button', async ({ page }) => {
    await startJourney(page);
    await selectDomesticAbuseOption(page, 'No');

    // Submit without filling to trigger error
    await page.getByRole('button', { name: /continue/i }).click();

    const errorSummary = page.locator('.govuk-error-summary');
    await expect(errorSummary).toBeVisible();

    // Browser back escapes the error page (destination varies by browser)
    await page.goBack();
    await expect(errorSummary).not.toBeVisible();

    // User can navigate to agree on child arrangements and complete the form
    await selectContactChildArrangementsOption(page, 'Yes')
    await expect(page).toHaveURL(/agree/);
  });
});

test.describe('Browser Navigation - Static Pages', () => {
  for (const staticPage of staticPages) {
    test(`should navigate back from ${staticPage.name}`, async ({ page }) => {
      await page.goto('/');
      await page.goto(staticPage.path);

      await expect(page).toHaveURL(new RegExp(staticPage.path));

      await verifyBackNavigation(page, '/');
    });
  }
});

test.describe('Browser Navigation - Flash Message Redirects', () => {
  test('should allow back navigation when redirected with "complete this page" message', async ({ page }) => {
    // Start journey and complete only the first step
    await startJourney(page);

    // Now at domestic abuse page, try to jump to other options page
    await page.goto('/other-options');

    // Should be redirected with flash message
    const flashMessage = page.locator('.govuk-notification-banner__heading');
    await expect(flashMessage).toContainText('Your progress was not saved. Please submit this page to continue.');

    // Verify we were redirected (not on other-options)
    await expect(page).not.toHaveURL(/other-options/);

    // Browser back should escape the redirect page
    await page.goBack();
    await expect(flashMessage).not.toBeVisible();
  });
});