import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should display the homepage with correct title', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle("Get help finding a child arrangement option – GOV.UK");
  });

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/');

    const cookiesLink = page.getByRole('link', { name: /cookies/i });
    await expect(cookiesLink).toBeVisible();

    const privacyLink = page.getByRole('link', { name: /privacy/i });
    await expect(privacyLink).toBeVisible();

    const accessibilityLink = page.getByRole('link', { name: /accessibility/i });
    await expect(accessibilityLink).toBeVisible();
  });

  test('should display the beta phase banner with feedback link', async ({ page }) => {
    await page.goto('/');

    const phaseBanner = page.locator('.govuk-phase-banner');
    await expect(phaseBanner).toBeVisible();
    await expect(phaseBanner).toContainText('Beta');
    await expect(phaseBanner).toContainText('This is a new service - your feedback will help us to improve it.');

    const feedbackLink = phaseBanner.getByRole('link', { name: /feedback/i });
    await expect(feedbackLink).toHaveAttribute('href', 'https://feedback.example.com');
  });

  test('should navigate to cookies page', async ({ page }) => {
    await page.goto('/');

    const cookiesLink = page.getByRole('link', { name: /cookies/i });
    await cookiesLink.click();

    await expect(page).toHaveURL(/\/cookies/);
  });
});
