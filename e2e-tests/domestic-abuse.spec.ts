import { test, expect } from '@playwright/test';

import { startJourney, selectChildSafetyOption } from './fixtures/test-helpers';

test.describe('Domestic Abuse Page', () => {
  test.beforeEach(async ({ page }) => {
    await startJourney(page);
    await selectChildSafetyOption(page, 'Yes');
  });

  test('should display the page with correct url and title', async ({ page }) => {
    await expect(page).toHaveURL(/domestic-abuse/);
    await expect(page.locator('h1')).toContainText('Have you experienced abuse from your ex-partner?');
  });

  test('should display risk factors as bullet list', async ({ page }) => {
    await expect(page.locator('body')).toContainText('Abuse or violence, including physical, emotional and sexual');
    await expect(page.locator('body')).toContainText('Financial or economic abuse');
    await expect(page.locator('body')).toContainText('Coercive control and psychological abuse (threats, humiliation, intimidation, degradation, isolation and control)');
    await expect(page.locator('body')).toContainText('Harassment and stalking');
  });

  test('should display Exit This Page button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /exit this page/i })).toBeVisible();
  });

  test('should display back link', async ({ page }) => {
    const backLink = page.locator('.govuk-back-link');
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute('href', '/child-safety');
  });

  test('should continue to getting help when yes is selected', async ({ page }) => {
    await page.getByLabel('Yes').check();
    await page.getByRole('button', { name: /continue/i }).click();
    await expect(page).toHaveURL(/getting-help/);
  });

  test('should continue to contact child arrangements when no is selected', async ({ page }) => {
    await page.getByLabel('No').check();
    await page.getByRole('button', { name: /continue/i }).click();
    await expect(page).toHaveURL(/contact-child-arrangements/);
  });

  test('should show a validation error when no option is selected', async ({ page }) => {
    await page.getByRole('button', { name: /continue/i }).click();
    await expect(page.locator('.govuk-error-summary')).toContainText(
      'Select whether you or your children have experienced abuse from your ex-partner',
    );
  });
});
