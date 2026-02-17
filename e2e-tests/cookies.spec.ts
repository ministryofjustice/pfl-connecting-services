import { test, expect } from '@playwright/test';

test.describe('Cookies', () => {
  test('should display the page with correct title', async ({ page }) => {
    await page.goto('/cookies');

    await expect(page).toHaveTitle("Cookies – Get help finding a child arrangement option – GOV.UK");
  });

  test('should navigate to aboutcookies.org external website', async ({ page }) => {
    await page.goto('/cookies');

    await page.locator('a.govuk-link').nth(1).click();

    await expect(page).toHaveURL('https://www.aboutcookies.org/');
  });
});
