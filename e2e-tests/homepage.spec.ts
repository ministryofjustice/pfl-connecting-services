import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should display the homepage with correct title', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle("Get help finding a child arrangement option – GOV.UK");
  });

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/');

    const cookiesLink = page.locator('.govuk-footer').getByRole('link', { name: /cookies/i });
    await expect(cookiesLink).toBeVisible();

    const privacyLink = page.locator('.govuk-footer').getByRole('link', { name: /privacy/i });
    await expect(privacyLink).toBeVisible();

    const accessibilityLink = page.locator('.govuk-footer').getByRole('link', { name: /accessibility/i });
    await expect(accessibilityLink).toBeVisible();
  });

  test('should navigate to cookies page', async ({ page }) => {
    await page.goto('/');

    const cookiesLink = page.locator('.govuk-footer').getByRole('link', { name: /cookies/i });
    await cookiesLink.click();

    await expect(page).toHaveURL(/\/cookies/);
  });
});
