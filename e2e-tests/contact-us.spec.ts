import { test, expect } from '@playwright/test';

test.describe('Contact Us Page', () => {
  test('should display the page with correct title and content', async ({ page }) => {
    await page.goto('/contact-us');

    await expect(page).toHaveTitle('Contact us – Get help finding a child arrangement option – GOV.UK');
    await expect(page.locator('h1')).toContainText('Contact us');

    await expect(page.locator('body')).toContainText('To report a problem or suggest improvements to this service, you can email:');
    await expect(page.locator('body')).toContainText('childarrangements@justice.gov.uk');
    await expect(page.locator('body')).toContainText('This email address should only be used for feedback on the digital service.');
    await expect(page.locator('body')).toContainText('We cannot answer any questions about child arrangements.');
  });

  test('should display email link with correct href', async ({ page }) => {
    await page.goto('/contact-us');

    const emailLink = page.locator('a[href="mailto:childarrangements@justice.gov.uk"]');
    await expect(emailLink).toBeVisible();
    await expect(emailLink).toContainText('childarrangements@justice.gov.uk');
  });

  test('should display Exit this page button in right column', async ({ page }) => {
    await page.goto('/contact-us');

    const exitButton = page.locator('.govuk-grid-column-one-third .govuk-exit-this-page');
    await expect(exitButton).toBeVisible();
  });

  test('should be accessible from footer link', async ({ page }) => {
    await page.goto('/');

    const footerLink = page.locator('.govuk-footer a:has-text("Contact us")');
    await expect(footerLink).toBeVisible();
    await expect(footerLink).toHaveAttribute('href', '/contact-us');

    await footerLink.click();
    await expect(page).toHaveURL('/contact-us');
  });
});