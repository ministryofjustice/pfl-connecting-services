import { test, expect } from '@playwright/test';

import { startJourney, selectDomesticAbuseOption, selectContactChildArrangementsOption } from './fixtures/test-helpers';

test.beforeEach(async ({ page }) => {
  await startJourney(page);
  await selectDomesticAbuseOption(page, "No");
  await selectContactChildArrangementsOption(page, 'No, I am not comfortable contacting them');
});

test.describe('Options no contact Page', () => {

  test('should display the page with correct url and title', async ({ page }) => {
    await expect(page).toHaveURL(/options-no-contact/);
    await expect(page.locator('h1')).toContainText('Options to explore if you are not comfortable contacting your ex-partner');
  });

  test('should also navigate to options no contact when "I can contact them but they do not respond" is selected on Contact Child Arrangements page', async ({ page }) => {
    await page.locator('a.govuk-back-link').click();
    await selectContactChildArrangementsOption(page, 'I can contact them but they do not respond');
    await expect(page).toHaveURL(/options-no-contact/);
    await expect(page.locator('h1')).toContainText('Options to explore if you are not comfortable contacting your ex-partner');
  });

  test('should navigate to contact child arrangements page when back link is clicked', async ({ page }) => {
    await page.locator('a.govuk-back-link').click();
    await expect(page).toHaveURL(/contact-child-arrangements/);
  });

  test('should navigate to resolution website', async ({ page }) => {
    await page.locator('#resolution-link').click();
    await expect(page).toHaveURL('https://resolution.org.uk/find-a-law-professional/');
  });

  test('should navigate to advice now website', async ({ page }) => {
    await page.locator('#advice-now-link').click();
    await expect(page).toHaveURL('https://www.advicenow.org.uk/get-help/family-and-children/child-arrangements');
  });
});