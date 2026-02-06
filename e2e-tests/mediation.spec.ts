import { test, expect } from '@playwright/test';

test.describe.skip('Mediation', () => {
  test('should display the page with correct title', async ({ page }) => {
    await page.goto('/other-options');

    await expect(page).toHaveTitle("Explore: Mediation – Get help finding a child arrangement option – GOV.UK");
  });

  test('should navigate to family mediation council website', async ({ page }) => {
    await page.goto('/options-no-contact');

    await page.locator('#mediation-link').click();

    await expect(page).toHaveURL('https://www.familymediationcouncil.org.uk/');
  });

  test('should navigate to find legal advice website', async ({ page }) => {
    await page.goto('/options-no-contact');

    await page.locator('#legal-advice-link').click();

    await expect(page).toHaveURL('https://find-legal-advice.justice.gov.uk/');
  });
});
