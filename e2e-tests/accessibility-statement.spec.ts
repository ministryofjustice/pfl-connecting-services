import { test, expect } from '@playwright/test';

test.describe('Accessibility Statement', () => {
  test('should display the page with correct title', async ({ page }) => {
    await page.goto('/accessibility');

    await expect(page).toHaveTitle('Accessibility statement – Get help finding a child arrangement option – GOV.UK');
  });

  test('should display correct page heading', async ({ page }) => {
    await page.goto('/accessibility');

    await expect(page.locator('h1')).toHaveText('Accessibility statement');
  });

  test('should display intro text about the service', async ({ page }) => {
    await page.goto('/accessibility');

    await expect(page.locator('text=This accessibility statement applies to')).toBeVisible();
    await expect(page.locator('text=This website is run by the Ministry of Justice')).toBeVisible();
  });

  test('should display ability list items', async ({ page }) => {
    await page.goto('/accessibility');

    await expect(page.locator('.govuk-list--bullet').first()).toContainText('change colours');
    await expect(page.locator('.govuk-list--bullet').first()).toContainText('zoom in up to 400%');
    await expect(page.locator('.govuk-list--bullet').first()).toContainText('keyboard or speech recognition');
    await expect(page.locator('.govuk-list--bullet').first()).toContainText('screen reader');
  });

  test('should display link to AbilityNet', async ({ page }) => {
    await page.goto('/accessibility');

    const abilityNetLink = page.locator('a:has-text("AbilityNet")');
    await expect(abilityNetLink).toHaveAttribute('href', 'https://mcmw.abilitynet.org.uk/');
  });

  test('should display "How accessible this website is" section', async ({ page }) => {
    await page.goto('/accessibility');

    await expect(page.locator('h2:has-text("How accessible this website is")')).toBeVisible();
    await expect(page.locator('text=assistive technologies')).toBeVisible();
  });

  test('should display "Feedback and contact information" section', async ({ page }) => {
    await page.goto('/accessibility');

    await expect(page.locator('h2:has-text("Feedback and contact information")')).toBeVisible();
    await expect(page.locator('a[href="mailto:childarrangements@justice.gov.uk"]')).toBeVisible();
  });

  test('should display "Enforcement procedure" section', async ({ page }) => {
    await page.goto('/accessibility');

    await expect(page.locator('h2:has-text("Enforcement procedure")')).toBeVisible();
    await expect(page.locator('text=Equality and Human Rights Commission')).toBeVisible();
  });

  test('should display link to EASS', async ({ page }) => {
    await page.goto('/accessibility');

    const eassLink = page.locator('a:has-text("Equality Advisory and Support Service (EASS)")');
    await expect(eassLink).toHaveAttribute('href', 'https://www.equalityadvisoryservice.com/');
  });

  test('should display "Technical information" section', async ({ page }) => {
    await page.goto('/accessibility');

    await expect(page.locator('h2:has-text("Technical information about this website")')).toBeVisible();
  });

  test('should display "Compliance status" section', async ({ page }) => {
    await page.goto('/accessibility');

    await expect(page.locator('h2:has-text("Compliance status")')).toBeVisible();
    await expect(page.locator('text=MOJ Accessibility Team')).toBeVisible();
    await expect(page.locator('text=partially compliant')).toBeVisible();
  });

  test('should display "Non-accessible content" section', async ({ page }) => {
    await page.goto('/accessibility');

    await expect(page.locator('h2:has-text("Non-accessible content")')).toBeVisible();
    await expect(page.locator('h3:has-text("Non-compliance with the accessibility regulations")')).toBeVisible();
  });

  test('should display Exit this page button issues', async ({ page }) => {
    await page.goto('/accessibility');

    await expect(page.locator('text=Screen reader users may experience the following issues')).toBeVisible();
    await expect(page.locator('text=Shift key')).toBeVisible();
  });

  test('should display "Preparation of this accessibility statement" section', async ({ page }) => {
    await page.goto('/accessibility');

    await expect(page.locator('h2:has-text("Preparation of this accessibility statement")')).toBeVisible();
    await expect(page.locator('text=9 February 2026')).toBeVisible();
  });

  test('should display Exit this page button in right column', async ({ page }) => {
    await page.goto('/accessibility');

    const exitButton = page.locator('.govuk-exit-this-page');
    await expect(exitButton).toBeVisible();
  });

  test('should be accessible from footer link', async ({ page }) => {
    await page.goto('/');

    const footerLink = page.locator('footer a:has-text("Accessibility statement")');
    await expect(footerLink).toBeVisible();
    await expect(footerLink).toHaveAttribute('href', '/accessibility');
  });
});
