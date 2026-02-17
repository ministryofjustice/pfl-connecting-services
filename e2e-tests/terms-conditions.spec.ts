import { test, expect } from '@playwright/test';

test.describe('Terms and Conditions', () => {
  test('should display the page with correct title', async ({ page }) => {
    await page.goto('/terms-conditions');

    await expect(page).toHaveTitle('Terms and conditions – Get help finding a child arrangement option – GOV.UK');
  });

  test('should display correct page heading', async ({ page }) => {
    await page.goto('/terms-conditions');

    await expect(page.locator('h1')).toHaveText('Terms and conditions');
  });

  test('should display "Responsibility for the service" section', async ({ page }) => {
    await page.goto('/terms-conditions');

    await expect(page.locator('h2').first()).toHaveText('Responsibility for the service');
    await expect(page.locator('text=Ministry of Justice (MOJ)')).toBeVisible();
    await expect(page.locator('text=MoJ accepts no liability for')).toBeVisible();
  });

  test('should display liability bullet points', async ({ page }) => {
    await page.goto('/terms-conditions');

    await expect(page.locator('.govuk-list--bullet').first()).toContainText('unable to access the service');
    await expect(page.locator('.govuk-list--bullet').first()).toContainText('indirect damages');
    await expect(page.locator('.govuk-list--bullet').first()).toContainText('external websites');
  });

  test('should display "Information about you and your site visits" section', async ({ page }) => {
    await page.goto('/terms-conditions');

    await expect(page.locator('h2:has-text("Information about you and your site visits")')).toBeVisible();
    await expect(page.locator('text=collect and process information')).toBeVisible();
    await expect(page.locator('text=By using this service you agree')).toBeVisible();
  });

  test('should display links to privacy notice and cookie policy', async ({ page }) => {
    await page.goto('/terms-conditions');

    const mainContent = page.locator('.govuk-grid-column-two-thirds');
    const privacyLink = mainContent.locator('a:has-text("privacy notice")');
    const cookieLink = mainContent.locator('a:has-text("cookie policy")');

    await expect(privacyLink).toHaveAttribute('href', '/privacy-notice');
    await expect(cookieLink).toHaveAttribute('href', '/cookies');
  });

  test('should display "Limitations of the service" section', async ({ page }) => {
    await page.goto('/terms-conditions');

    await expect(page.locator('h2:has-text("Limitations of the service")')).toBeVisible();
    await expect(page.locator('text=does not guarantee')).toBeVisible();
  });

  test('should display "Misuse" section', async ({ page }) => {
    await page.goto('/terms-conditions');

    await expect(page.locator('h2:has-text("Misuse")')).toBeVisible();
    await expect(page.locator('text=must not impersonate another person')).toBeVisible();
  });

  test('should display "Restrictions on use" section', async ({ page }) => {
    await page.goto('/terms-conditions');

    await expect(page.locator('h2:has-text("Restrictions on use")')).toBeVisible();
    await expect(page.locator('text=court order in place')).toBeVisible();
    await expect(page.locator('text=legal consequences')).toBeVisible();
  });

  test('should display Exit this page button', async ({ page }) => {
    await page.goto('/terms-conditions');

    await expect(page.locator('text=Exit this page')).toBeVisible();
  });

  test('should be accessible from footer link', async ({ page }) => {
    await page.goto('/');

    const footerLink = page.locator('footer a:has-text("Terms and conditions")');
    await expect(footerLink).toBeVisible();
    await expect(footerLink).toHaveAttribute('href', '/terms-conditions');
  });
});
