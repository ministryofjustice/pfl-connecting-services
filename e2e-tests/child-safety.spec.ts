import { test, expect } from '@playwright/test';

import { startJourney, selectChildSafetyOption } from './fixtures/test-helpers';

test.beforeEach(async ({ page }) => {
  await startJourney(page);
});

test.describe('Child Safety Page', () => {
  test('should display the page with correct url and title', async ({ page }) => {
    await expect(page).toHaveURL(/child-safety/);
    await expect(page.locator('h1')).toContainText('Are the children safe?');
  });

  test('should display risk factors as bullet list', async ({ page }) => {
    await expect(page.locator('body')).toContainText(
      'any form of domestic abuse or violence, even if the abuse was not directed at the children',
    );
    await expect(page.locator('body')).toContainText('actual or attempted child abduction');
    await expect(page.locator('body')).toContainText('child abuse or neglect');
    await expect(page.locator('body')).toContainText('misuse of drugs, alcohol or other substances');
    await expect(page.locator('body')).toContainText(
      'any other safety or welfare concerns that place anyone at significant risk of harm',
    );
    await expect(page.locator('body')).toContainText(
      'We ask this so we can give you the right information and resources for your situation.'
    );
  });

  test('should display Exit This Page button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /exit this page/i })).toBeVisible();
  });

  test('should display back link', async ({ page }) => {
    const backLink = page.locator('.govuk-back-link');
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute('href', '/');
  });

  test('should navigate to domestic abuse page when Yes option selected (children are safe)', async ({ page }) => {
    await selectChildSafetyOption(page, 'Yes');
    await expect(page).toHaveURL(/domestic-abuse/);
  });

  test('should navigate to child safety help page when No option selected (children not safe)', async ({ page }) => {
    await selectChildSafetyOption(page, 'No');
    await expect(page).toHaveURL(/child-safety-help/);
  });

  test('should display error summary when Continue clicked without selecting an option', async ({ page }) => {
    await page.getByRole('button', { name: /continue/i }).click();

    const errorSummary = page.locator('.govuk-error-summary');
    await expect(errorSummary).toBeVisible();

    await expect(page.locator('.govuk-error-summary__title')).toHaveText('There is a problem');

    const errorLink = page.locator('.govuk-error-summary__list a');
    await expect(errorLink).toHaveText('Select whether the children are safe');
  });

  test('should have error link that focuses the first radio input when clicked', async ({ page }) => {
    await page.getByRole('button', { name: /continue/i }).click();

    const errorLink = page.locator('.govuk-error-summary__list a');
    await expect(errorLink).toHaveAttribute('href', '#childSafety');

    await errorLink.click();

    await expect(page.getByLabel('Yes')).toBeFocused();
  });

  test('should display inline error message on the radio group', async ({ page }) => {
    await page.getByRole('button', { name: /continue/i }).click();

    const inlineError = page.locator('.govuk-error-message');
    await expect(inlineError).toContainText('Select whether the children are safe');
  });

  test('should navigate back to start page when back link clicked', async ({ page }) => {
    await page.locator('.govuk-back-link').click();
    await expect(page).toHaveURL('/');
  });
});
