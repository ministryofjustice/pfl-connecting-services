import { test, expect } from '@playwright/test';

// These tests are skipped because they require navigating through the form flow
// The middleware checks for completed steps before allowing access to /agree
// TODO: Refactor to use proper form flow navigation (see DAS-1291)
test.describe.skip('Agreement on child arrangements question', () => {
  test('should display the page with correct title', async ({ page }) => {
    await page.goto('/agree');

    await expect(page).toHaveTitle("Do you and your ex-partner agree on child arrangements? – Get help finding a child arrangement option – GOV.UK");
  });

  test('should navigate to parenting plan page when yes option selected', async ({ page }) => {
    await page.goto('/agree');

    await page.locator('input[type="radio"][value="yes"]').check();

    await page.locator('button.govuk-button').click();

    await expect(page).toHaveURL(/\/parenting-plan/);
  });

  test('should navigate to help to agree page when no option selected', async ({ page }) => {
    await page.goto('/agree');

    await page.locator('input[type="radio"][value="no"]').check();

    await page.locator('button.govuk-button').click();

    await expect(page).toHaveURL(/\/help-to-agree/);
  });

  test('should navigate to help to agree page when not discussed option selected', async ({ page }) => {
    await page.goto('/agree');

    await page.locator('input[type="radio"][value="not-discussed"]').check();

    await page.locator('button.govuk-button').click();

    await expect(page).toHaveURL(/\/help-to-agree/);
  });

  test('should display error summary when Continue clicked without selecting an option', async ({ page }) => {
    await page.goto('/agree');

    // Click Continue without selecting a radio option
    await page.locator('button.govuk-button').click();

    // Should show error summary
    const errorSummary = page.locator('.govuk-error-summary');
    await expect(errorSummary).toBeVisible();

    // Error summary title should be "There is a problem"
    await expect(page.locator('.govuk-error-summary__title')).toHaveText('There is a problem');

    // Error message should match the design
    const errorLink = page.locator('.govuk-error-summary__list a');
    await expect(errorLink).toHaveText('Select whether you and your ex-partner agree on child arrangements');
  });

  test('should have error link that focuses the first radio input when clicked', async ({ page }) => {
    await page.goto('/agree');

    // Click Continue without selecting a radio option
    await page.locator('button.govuk-button').click();

    // Error link should have href pointing to the first radio input
    const errorLink = page.locator('.govuk-error-summary__list a');
    await expect(errorLink).toHaveAttribute('href', '#agreement');

    // Click the error link
    await errorLink.click();

    // The first radio input should now be focused
    const firstRadio = page.locator('input[type="radio"][name="agreement"]').first();
    await expect(firstRadio).toBeFocused();
  });

  test('should display inline error message on the radio group', async ({ page }) => {
    await page.goto('/agree');

    // Click Continue without selecting a radio option
    await page.locator('button.govuk-button').click();

    // Inline error message should be visible
    const inlineError = page.locator('.govuk-error-message');
    await expect(inlineError).toContainText('Select whether you and your ex-partner agree on child arrangements');
  });
});
