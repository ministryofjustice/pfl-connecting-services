import { test, expect } from '@playwright/test';

import { startJourney, selectChildSafetyOption, selectDomesticAbuseOption } from './fixtures/test-helpers';

test.describe('Safeguarding Page', () => {
  test.beforeEach(async ({ page }) => {
    await startJourney(page);
    await selectChildSafetyOption(page, 'Yes');
    await selectDomesticAbuseOption(page, 'Yes');
  });

  test('should display the page with correct url and title', async ({ page }) => {
    await expect(page).toHaveURL(/getting-help/);
    await expect(page.locator('h1')).toContainText('Getting help if you have experienced abuse');
  });

  test('should display warning text about immediate danger', async ({ page }) => {
    await expect(page.locator('.govuk-warning-text')).toContainText(
      'If you are in immediate danger, call 999 and ask for the police.',
    );
  });

  test('should display Exit This Page button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /exit this page/i })).toBeVisible();
  });

  test('should display back link', async ({ page }) => {
    const backLink = page.locator('.govuk-back-link');
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute('href', '/domestic-abuse');
  });

  test('should display help and support section with helpline details', async ({ page }) => {
    await expect(page.locator('body')).toContainText('Refuge National Domestic Abuse Helpline');
    await expect(page.locator('body')).toContainText('0808 2000 247');
    await expect(page.locator('body')).toContainText("Rights of Women");
    await expect(page.locator('body')).toContainText('0808 801 0327');
  });

  test('should continue to contact child arrangements when continue is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /continue/i }).click();
    await expect(page).toHaveURL(/contact-child-arrangements/);
  });
});