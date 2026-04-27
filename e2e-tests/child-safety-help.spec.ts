import { test, expect } from '@playwright/test';

test.describe('Child Safety Help Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/child-safety-help');
  });

  test('should display the page with correct url and title', async ({ page }) => {
    await expect(page).toHaveURL(/child-safety-help/);
    await expect(page.locator('h1')).toContainText('Getting help if your children are not safe');
  });

  test('should display warning about contacting police', async ({ page }) => {
    const warningText = page.locator('.govuk-warning-text');
    await expect(warningText).toBeVisible();
    await expect(warningText).toContainText('Contact the police');
    await expect(warningText).toContainText('immediate danger');
  });

  test('should display introductory text', async ({ page }) => {
    await expect(page.locator('body')).toContainText('help and support available to you');
  });

  test('should display Continue button', async ({ page }) => {
    const continueButton = page.locator('a.govuk-button:has-text("Continue")');
    await expect(continueButton).toBeVisible();
    await expect(continueButton).toHaveAttribute('href', '/domestic-abuse');
  });

  test('should display "If you want to continue using this service" section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'If you want to continue using this service' })).toBeVisible();
  });

  test('should display "Get help protecting your children" section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Get help protecting your children' })).toBeVisible();
  });

  test('should display "If you believe your child could be taken out of the UK without your permission" subsection', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'If you believe your child could be taken out of the UK without your permission' })).toBeVisible();
    await expect(page.locator('body')).toContainText('what to do if you believe a child could be taken or has been taken abroad without your permission');
  });

  test('should display "If you or your children have experienced domestic abuse" subsection', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'If you or your children have experienced domestic abuse' })).toBeVisible();
    await expect(page.locator('body')).toContainText('apply for a court order to protect yourself');
  });

  test('should display "Help and support" section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Help and support' })).toBeVisible();
  });

  test('should display help and support table with services', async ({ page }) => {
    await expect(page.locator('.govuk-summary-list')).toContainText("Refuge National Domestic Abuse Helpline");
    await expect(page.locator('.govuk-summary-list')).toContainText('Rights of Women');
    await expect(page.locator('.govuk-summary-list')).toContainText('Reunite International Child Abduction Centre');
  });

  test('should display Exit this page button in right column', async ({ page }) => {
    const exitButton = page.locator('.govuk-grid-column-one-third .govuk-exit-this-page');
    await expect(exitButton).toBeVisible();
  });

  test('should display back link', async ({ page }) => {
    const backLink = page.locator('.govuk-back-link');
    await expect(backLink).toBeVisible();
  });

  test('should have correct phone numbers for helplines', async ({ page }) => {
    await expect(page.locator('.govuk-summary-list')).toContainText('0808 2000 247');
    await expect(page.locator('.govuk-summary-list')).toContainText('020 7251 6577');
    await expect(page.locator('.govuk-summary-list')).toContainText('0116 2556 234');
  });
});
