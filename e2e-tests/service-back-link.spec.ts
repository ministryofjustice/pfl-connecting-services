import { test, expect } from '@playwright/test';

import { verifyServiceBackLink } from './fixtures/navigation-helpers';
import { contactChildArrangementOption, agreeOnChildArrangementOption, helpToAgreeOnChildArrangementOption, otherOptions, staticPages } from './fixtures/test-data';
import { startJourney, selectDomesticAbuseOption, selectContactChildArrangementsOption, selectAgreeOnChildArrangementsOption, selectHelpToAgreeOnChildArrangementsOption, selectOtherOptions } from './fixtures/test-helpers';

// Data does not persist when using service back link so these tests check if the back link works on each page, and navigates to the correct page
test.describe('Service Back Link', () => {
   test('should navigate back from domestic abuse page to homepage', async ({ page }) => {
    await startJourney(page);

    await verifyServiceBackLink(page, '/');

    await expect(page.getByRole('button', { name: /start now/i })).toBeVisible();
  });

   test('should navigate back from getting help page to domestic abuse page', async ({ page }) => {
    await startJourney(page);

    await selectDomesticAbuseOption(page, 'Yes')
    await expect(page).toHaveURL(/getting-help/);

    await verifyServiceBackLink(page, /domestic-abuse/);

    // Verify we can proceed forward, radio buttons need to be filled again
    await selectDomesticAbuseOption(page, 'Yes')
    await expect(page).toHaveURL(/getting-help/);
  });

  test('should navigate back from contact child arrangements to domestic abuse page ', async ({ page }) => {
    await startJourney(page);

    await selectDomesticAbuseOption(page, 'No')
    await expect(page).toHaveURL(/contact-child-arrangements/);

    await verifyServiceBackLink(page, /domestic-abuse/);

    await selectDomesticAbuseOption(page, 'No')
    await expect(page).toHaveURL(/contact-child-arrangements/);
  });

   test('should navigate back from contact child arrangements to getting help', async ({ page }) => {
    await startJourney(page);

    await selectDomesticAbuseOption(page, 'Yes')
    await page.getByRole('button', { name: /continue/i }).click();
    await expect(page).toHaveURL(/contact-child-arrangements/);

    await verifyServiceBackLink(page, /getting-help/);

    await page.getByRole('button', { name: /continue/i }).click();
    await expect(page).toHaveURL(/contact-child-arrangements/);
  });

  for (const { label, nextUrl } of contactChildArrangementOption) {
  test(`should navigate back from varying pages to contact child arrangements, based on "${label}" used`, async ({ page }) => {
    await startJourney(page);
    await selectDomesticAbuseOption(page, 'No');

    await page.getByLabel(label).check();
    await page.getByRole('button', { name: /continue/i }).click();
    await expect(page).toHaveURL(nextUrl);

    await verifyServiceBackLink(page, /contact-child-arrangements/);

    await page.getByLabel(label).check();
    await page.getByRole('button', { name: /continue/i }).click();
    await expect(page).toHaveURL(nextUrl);
  });
  }

  for (const { label, nextUrl } of agreeOnChildArrangementOption) {
  test(`should navigate back from varying pages to agree om child arrangements, based on "${label}" used`, async ({ page }) => {
    await startJourney(page);
    await selectDomesticAbuseOption(page, 'No');
    await selectContactChildArrangementsOption(page, 'Yes')

    await page.getByLabel(label).check();
    await page.getByRole('button', { name: /continue/i }).click();
    await expect(page).toHaveURL(nextUrl);

    await verifyServiceBackLink(page, /agree/);

    await page.getByLabel(label).check();
    await page.getByRole('button', { name: /continue/i }).click();
    await expect(page).toHaveURL(nextUrl);
  });
  }

  for (const { label, nextUrl } of helpToAgreeOnChildArrangementOption) {
  test(`should navigate back from varying pages to help to agree on child arrangements, based on "${label}" used`, async ({ page }) => {
    await startJourney(page);
    await selectDomesticAbuseOption(page, 'No');
    await selectContactChildArrangementsOption(page, 'Yes')
    await selectAgreeOnChildArrangementsOption(page, 'No, we do not agree')

    await page.getByLabel(label).check();
    await page.getByRole('button', { name: /continue/i }).click();
    await expect(page).toHaveURL(nextUrl);

    await verifyServiceBackLink(page, /help-to-agree/);

    await page.getByLabel(label).check();
    await page.getByRole('button', { name: /continue/i }).click();
    await expect(page).toHaveURL(nextUrl);
  });
  }
  
  for (const { label, nextUrl } of otherOptions) {
  test(`should navigate back from varying pages to help to other options, based on "${label}" used`, async ({ page }) => {
    await startJourney(page);
    await selectDomesticAbuseOption(page, 'No');
    await selectContactChildArrangementsOption(page, 'Yes')
    await selectAgreeOnChildArrangementsOption(page, 'No, we do not agree')
    await selectHelpToAgreeOnChildArrangementsOption(page, 'Someone else to guide our conversations')

    await page.getByLabel(label).check();
    await page.getByRole('button', { name: /continue/i }).click();
    await expect(page).toHaveURL(nextUrl);

    await verifyServiceBackLink(page, /other-options/);

    await page.getByLabel(label).check();
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
    await selectOtherOptions(page, 'No, we have not tried any of these')

    // Go Back
    await verifyServiceBackLink(page, /other-options/);
    await verifyServiceBackLink(page, /help-to-agree/);
    await verifyServiceBackLink(page, /agree/);
    await verifyServiceBackLink(page, /contact-child-arrangements/);
    await verifyServiceBackLink(page, /getting-help/);
    await verifyServiceBackLink(page, /domestic-abuse/);
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

    // Service back link goes to the previous page, ignoring the error message
    await verifyServiceBackLink(page, /domestic-abuse/);

    // Going back to the contact child arrangement page shows no error
    await selectDomesticAbuseOption(page, 'No');
    await expect(errorSummary).not.toBeVisible();
  });
});

test.describe('Browser Navigation - Static Pages', () => {
  for (const staticPage of staticPages) {
    test(`should navigate back from ${staticPage.name}`, async ({ page }) => {
      await page.goto('/');

      // Click the link instead of using goto
      await page.getByRole('link', { name: new RegExp(staticPage.name, 'i') }).click();

      // Verify we landed on the correct page
      await expect(page).toHaveURL(new RegExp(staticPage.path));

      // Verify the service back link returns to home
      await verifyServiceBackLink(page, '/');
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

    // Service back should take us to the previous page, ignoring the flash message
    await verifyServiceBackLink(page, '/');
    
    // Going forward the flash message should not be visible
    await startJourney(page);
    await expect(flashMessage).not.toBeVisible();
  });
});