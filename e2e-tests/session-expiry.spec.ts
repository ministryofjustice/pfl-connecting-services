import { test, expect } from '@playwright/test';

import { startJourney, selectChildSafetyOption, selectDomesticAbuseOption, selectContactChildArrangementsOption, selectAgreeOnChildArrangementsOption, selectHelpToAgreeOnChildArrangementsOption } from './fixtures/test-helpers';

test.describe.configure({ mode: 'serial' });

test.describe('Session Expiry', () => {
  test('should redirect to start page when session expires mid-journey', async ({ page }) => {
    await startJourney(page);
    await selectChildSafetyOption(page, 'Yes');
    await expect(page).toHaveURL(/domestic-abuse/);
    await page.context().clearCookies();
    await page.goto('/other-options');
    await expect(page).toHaveURL('/');
  });

   test('should allow user to start a new journey after session expires', async ({ page }) => {
    await startJourney(page);
    await selectChildSafetyOption(page, 'Yes');
    await selectDomesticAbuseOption(page, 'No')
    await selectContactChildArrangementsOption(page, 'I can contact them but they do not respond')
    await page.context().clearCookies();
    // Reload to ensure clean state after cookie clear
    await page.reload();
    // Start a fresh journey after session expires - user should be able to continue
    await startJourney(page);
    await expect(page).toHaveURL(/child-safety/);
  });

  test('should redirect deep-linked other options page to start after session expires', async ({ page }) => {
    await startJourney(page);
    await selectChildSafetyOption(page, 'Yes');
    await selectDomesticAbuseOption(page, 'Yes');
    await page.getByRole('button', { name: /continue/i }).click();
    await selectContactChildArrangementsOption(page, 'Yes')
    await selectAgreeOnChildArrangementsOption(page, 'No, we do not agree')
    await selectHelpToAgreeOnChildArrangementsOption(page, 'Someone else to guide our conversations')
    await expect(page).toHaveURL('/other-options');
    await page.context().clearCookies();
    await page.goto('/other-options');
    await expect(page).toHaveURL('/');
  });
});
