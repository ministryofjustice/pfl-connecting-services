import { test, expect } from '@playwright/test';

import {
  startJourney,
  selectChildSafetyOption,
  selectDomesticAbuseOption,
  selectContactChildArrangementsOption,
  selectAgreeOnChildArrangementsOption,
} from './fixtures/test-helpers';

test.beforeEach(async ({ page }) => {
  await startJourney(page);
  await selectChildSafetyOption(page, 'Yes');
  await selectDomesticAbuseOption(page, 'No');
  await selectContactChildArrangementsOption(page, 'Yes');
});

test.describe('Agreement on child arrangements Page', () => {
  test('should display the page with correct url and title', async ({ page }) => {
    await expect(page).toHaveURL(/agree/);
    await expect(page.locator('h1')).toContainText('Do you and your ex-partner agree on child arrangements?');
  });

  test('should navigate to parenting plan page when yes option selected', async ({ page }) => {
    await selectAgreeOnChildArrangementsOption(page, 'Yes, we agree on some or most things');
    await expect(page).toHaveURL(/\/parenting-plan/);
  });

  test('should navigate to help to agree page when No, we do not agree option is selected', async ({ page }) => {
    await selectAgreeOnChildArrangementsOption(page, 'No, we do not agree');
    await expect(page).toHaveURL(/\/help-to-agree/);
  });

  test('should navigate to help to agree page when not discussed option selected', async ({ page }) => {
    await selectAgreeOnChildArrangementsOption(page, 'We have not discussed it yet');
    await expect(page).toHaveURL(/\/help-to-agree/);
  });

  test('should display error summary when Continue clicked without selecting an option', async ({ page }) => {
    await page.getByRole('button', { name: /continue/i }).click();

    const errorSummary = page.locator('.govuk-error-summary');
    await expect(errorSummary).toBeVisible();

    await expect(page.locator('.govuk-error-summary__title')).toHaveText('There is a problem');

    const errorLink = page.locator('.govuk-error-summary__list a');
    await expect(errorLink).toHaveText('Select whether you and your ex-partner agree on child arrangements');
  });

  test('should have error link that focuses the first radio input when clicked', async ({ page }) => {
    await page.getByRole('button', { name: /continue/i }).click();

    const errorLink = page.locator('.govuk-error-summary__list a');
    await expect(errorLink).toHaveAttribute('href', '#agreement');

    await errorLink.click();

    await expect(page.getByLabel('Yes, we agree on some or most things')).toBeFocused();
  });

  test('should display inline error message on the radio group', async ({ page }) => {
    await page.getByRole('button', { name: /continue/i }).click();

    const inlineError = page.locator('.govuk-error-message');
    await expect(inlineError).toContainText('Select whether you and your ex-partner agree on child arrangements');
  });
});
