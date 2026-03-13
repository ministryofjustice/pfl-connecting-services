import { test, expect } from '@playwright/test';

import { startJourney, selectDomesticAbuseOption, selectContactChildArrangementsOption, selectAgreeOnChildArrangementsOption, selectHelpToAgreeOnChildArrangementsOption} from './fixtures/test-helpers';

test.describe('Other options', () => {

  test.beforeEach(async ({ page }) => {
    await startJourney(page);
    await selectDomesticAbuseOption(page, "No");
    await selectContactChildArrangementsOption(page, 'Yes');
    await selectAgreeOnChildArrangementsOption(page, 'No, we do not agree');
    await selectHelpToAgreeOnChildArrangementsOption(page, 'Someone else to guide our conversations');
  });
  
  test('should display the page with correct url and title', async ({ page }) => {
    await expect(page).toHaveURL(/other-options/);
    await expect(page.locator('h1')).toContainText('Have you tried any of the following together in the last 6 months?');
  });

  test('should navigate to help to agree page when back link is clicked', async ({ page }) => {
    await page.locator('a.govuk-back-link').click();

    await expect(page).toHaveURL(/\/help-to-agree/);
  });

  test('should navigate to court order page when yes option is selected', async ({ page }) => {
    await page.locator('input[type="radio"][value="yes"]').check();

    await page.locator('button.govuk-button').click();

    await expect(page).toHaveURL(/\/court-order/);
  });

  test('should navigate to mediation page when no option is selected', async ({ page }) => {
    await page.locator('input[type="radio"][value="no"]').check();

    await page.locator('button.govuk-button').click();

    await expect(page).toHaveURL(/\/mediation/);
  });
});
