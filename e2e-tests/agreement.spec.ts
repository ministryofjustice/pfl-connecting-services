import { test, expect } from '@playwright/test';

import { navigateToAgreement } from './fixtures/test-helpers';

test.describe('Agreement on child arrangements question', () => {
  test('should display the page with correct title', async ({ page }) => {
    await navigateToAgreement(page);

    await expect(page).toHaveTitle("Do you and your ex-partner agree on child arrangements? – Get help finding a child arrangement option – GOV.UK");
  });

  test('should navigate to parenting plan page when yes option selected', async ({ page }) => {
    await navigateToAgreement(page);

    await page.locator('input[type="radio"][value="yes"]').check();

    await page.locator('button.govuk-button').click();

    await expect(page).toHaveURL(/\/parenting-plan/);
  });

  test('should navigate to help to agree page when no option selected', async ({ page }) => {
    await navigateToAgreement(page);

    await page.locator('input[type="radio"][value="no"]').check();

    await page.locator('button.govuk-button').click();

    await expect(page).toHaveURL(/\/help-to-agree/);
  });

  test('should navigate to help to agree page when not discussed option selected', async ({ page }) => {
    await navigateToAgreement(page);

    await page.locator('input[type="radio"][value="not-discussed"]').check();

    await page.locator('button.govuk-button').click();

    await expect(page).toHaveURL(/\/help-to-agree/);
  });
});
