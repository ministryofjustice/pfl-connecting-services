import { test, expect } from '@playwright/test';

test.describe.skip('Other options', () => {
  test('should display the page with correct title', async ({ page }) => {
    await page.goto('/other-options');

    await expect(page).toHaveTitle("Have you tried any of the following together in the last 6 months? – Get help finding a child arrangement option – GOV.UK");
  });

  test('should navigate to help to agree page when back link is clicked', async ({ page }) => {
    await page.goto('/other-options');

    await page.locator('a.govuk-back-link').click();

    await expect(page).toHaveURL(/\/help-to-agree/);
  });

  test('should navigate to court order page when yes option is selected', async ({ page }) => {
    await page.goto('/other-options');

    await page.locator('input[type="radio"][value="yes"]').check();

    await page.locator('button.govuk-button').click();

    await expect(page).toHaveURL(/\/court-order/);
  });

  test('should navigate to mediation page when no option is selected', async ({ page }) => {
    await page.goto('/other-options');

    await page.locator('input[type="radio"][value="no"]').check();

    await page.locator('button.govuk-button').click();

    await expect(page).toHaveURL(/\/mediation/);
  });
});
