import { test, expect } from '@playwright/test';

test.describe('Options no contact', () => {
  test('should display the page with correct title', async ({ page }) => {
    await page.goto('/options-no-contact');

    await expect(page).toHaveTitle("Options to explore if you are not comfortable contacting your ex-partner – Get help finding a child arrangement option – GOV.UK");
  });

  test('should navigate to contact comfort page when back link is clicked', async ({ page }) => {
    await page.goto('/options-no-contact');

    await page.locator('a.govuk-back-link').click();

    await expect(page).toHaveURL(/\/contact-comfort/);
  });

  test('should navigate to family mediation council website', async ({ page }) => {
    await page.goto('/options-no-contact');

    await page.locator('#mediation-link').click();

    await expect(page).toHaveURL('https://www.familymediationcouncil.org.uk/');
  });

  test('should navigate to citizens advice website', async ({ page }) => {
    await page.goto('/options-no-contact');

    await page.locator('#citizens-advice-link').click();

    await expect(page).toHaveURL('https://www.citizensadvice.org.uk/family/making-agreements-about-your-children/your-child-arrangements-arent-working/');
  });
});
