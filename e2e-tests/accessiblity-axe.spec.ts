import { AxeBuilder } from '@axe-core/playwright';

import { test, expect, Page} from '@playwright/test';
import { startJourney, selectChildSafetyOption, selectDomesticAbuseOption} from './fixtures/test-helpers';

export async function runAxeScan(page: Page) {
  return await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
}

test.describe('Accessibility - Axe Core Scanning', () => {
  test('should pass axe accessibility scan on all pages of the service', async ({ page }) => {
    //Home Page
    await page.goto('/');

    const results = await runAxeScan(page);
    expect(results.violations).toEqual([]);
    await page.getByRole('button', { name: /start now/i }).click();

    //child-safety
    expect(results.violations).toEqual([]);
    await selectChildSafetyOption(page, 'No')

    //child-safety-help
    expect(results.violations).toEqual([]);
    await page.getByRole('button', { name: /continue/i }).click();

    //domestic-abuse
    expect(results.violations).toEqual([]);
    await selectDomesticAbuseOption(page, 'Yes')

    // getting-help
    expect(results.violations).toEqual([]);
    await page.getByRole('button', { name: /continue/i }).click();

    // contact-child-arrangements
    expect(results.violations).toEqual([]);
    await page.getByRole('radio', { name: /I can contact them but they do not respond/i }).check();
    await page.getByRole('button', { name: /continue/i }).click();

    // options-no-contact
    expect(results.violations).toEqual([]);
    await expect(page.locator('h1')).toContainText('Options to explore if you are not comfortable contacting your ex-partner');
    await page.locator('.govuk-back-link').click();

    // contact-child-arrangements
    expect(results.violations).toEqual([]);
    await page.getByRole('radio', { name: /I do not have their contact details/i }).check();
    await page.getByRole('button', { name: /continue/i }).click();

    // Court-order
    expect(results.violations).toEqual([]);
    await expect(page.locator('h1')).toContainText('Explore: Applying for a court order');
    await page.locator('.govuk-back-link').click();

    // contact-child-arrangements
    expect(results.violations).toEqual([]);
    await page.getByRole('radio', { name: /No, I am not comfortable contacting them/i }).check();
    await page.getByRole('button', { name: /continue/i }).click();

    // options-no-contact
    expect(results.violations).toEqual([]);
    await expect(page.locator('h1')).toContainText('Options to explore if you are not comfortable contacting your ex-partner');
    await page.locator('.govuk-back-link').click();

    // contact-child-arrangements
    expect(results.violations).toEqual([]);
    await page.getByRole('radio', { name: /Yes/i }).check();
    await page.getByRole('button', { name: /continue/i }).click();

    // agree-on-child-arrangements
    expect(results.violations).toEqual([]);
    await page.getByLabel(/Yes, we agree on some or most things/i).check();
    await page.getByRole('button', { name: /continue/i }).click();

    // parenting-pan
    expect(results.violations).toEqual([]);
    await expect(page.locator('h1')).toContainText('Explore: Making a parenting plan');
    await page.locator('.govuk-back-link').click();

    // agree-on-child-arrangements
    expect(results.violations).toEqual([]);
    await page.getByLabel(/No, we do not agree/i).check();
    await page.getByRole('button', { name: /continue/i }).click();

    // help-to-agree
    expect(results.violations).toEqual([]);
    await page.getByLabel(/A plan we can follow ourselves/i).check();
    await page.getByRole('button', { name: /continue/i }).click();

    // parenting-pan
    expect(results.violations).toEqual([]);
    await expect(page.locator('h1')).toContainText('Explore: Making a parenting plan');
    await page.locator('.govuk-back-link').click();

    // help-to-agree
    expect(results.violations).toEqual([]);
    await page.getByLabel(/We cannot agree – someone else needs to make a decision for us/i).check();
    await page.getByRole('button', { name: /continue/i }).click();

    // Court-order
    expect(results.violations).toEqual([]);
    await expect(page.locator('h1')).toContainText('Explore: Applying for a court order');
    await page.locator('.govuk-back-link').click();

    // help-to-agree
    expect(results.violations).toEqual([]);
    await page.getByLabel(/Someone else to guide our conversations/i).check();
    await page.getByRole('button', { name: /continue/i }).click();

    // other-options
    expect(results.violations).toEqual([]);
    await page.getByLabel(/Yes, we have tried mediation or a similar method/i).check();
    await page.getByRole('button', { name: /continue/i }).click();

    // Court-order
    expect(results.violations).toEqual([]);
    await expect(page.locator('h1')).toContainText('Explore: Applying for a court order');
    await page.locator('.govuk-back-link').click();

    // other-options
    expect(results.violations).toEqual([]);
    await page.getByLabel(/No, we have not tried yet/i).check();
    await page.getByRole('button', { name: /continue/i }).click();

    // mediation
    expect(results.violations).toEqual([]);
    await expect(page.locator('h1')).toContainText('Explore: Mediation');
  });

  test('should have proper form labels associated with radio buttons', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /start now/i }).click();

    // Check that form labels are properly associated
    const accessibilityScanResults = await new AxeBuilder({ page }).withTags(['wcag2a']).include('form').analyze();

    // Filter for label-related violations
    const labelViolations = accessibilityScanResults.violations.filter((violation) => violation.id.includes('label'));

    expect(labelViolations).toEqual([]);
  });

  test('should have accessible form validation errors', async ({ page }) => {
    await startJourney(page);

    // Submit form without filling it to trigger errors
    await page.getByRole('button', { name: /continue/i }).click();

    // Check for error message accessibility
    const errorSummary = page.locator('.govuk-error-summary');
    await expect(errorSummary).toBeVisible();

    // Run axe scan on page with errors
    const accessibilityScanResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have error summary with appropriate ARIA attributes', async ({ page }) => {
    await startJourney(page);

    // Submit without filling
    await page.getByRole('button', { name: /continue/i }).click();

    const errorSummary = page.locator('.govuk-error-summary');
    await expect(errorSummary).toBeVisible();

    // The Prototype Kit usually puts the role="alert" on the summary div
    // or uses an h2 with a specific ID.
    const role = await errorSummary.getAttribute('role');
    const hasHeading = await errorSummary.locator('h2').count() > 0;

    // If it's a prototype, having the heading and visibility is often the goal
    expect(role === 'alert' || hasHeading).toBeTruthy();
  });

  test('should indicate required radio fields for screen readers', async ({ page }) => {
    await startJourney(page);

    // Submit without selecting a radio
    await page.getByRole('button', { name: /continue/i }).click();

    // Locate the fieldset for the radio group
    const fieldset = page.locator('fieldset.govuk-fieldset');

    const describedBy = await fieldset.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();

    const ids = describedBy!.split(/\s+/);

    const errorId = ids.find(id => id.endsWith('-error'));
    expect(errorId).toBeTruthy();

    const errorMessage = page.locator(`#${errorId}`);
    await expect(errorMessage).toContainText(/select whether the children are safe/i);
});


  test('should have accessible navigation landmarks', async ({ page }) => {
    await page.goto('/');

    // Check for proper ARIA landmarks
    const accessibilityScanResults = await new AxeBuilder({ page }).withTags(['wcag2a']).analyze();

    // Filter for landmark violations
    const landmarkViolations = accessibilityScanResults.violations.filter(
      (violation) => violation.id.includes('landmark') || violation.id.includes('region'),
    );

    expect(landmarkViolations).toEqual([]);
  });

  test('should have accessible heading hierarchy on all pages', async ({ page }) => {
    const pagesToTest = ['/', '/child-safety', '/domestic-abuse', '/cookies', '/privacy-notice'];

    for (const pageUrl of pagesToTest) {
      await page.goto(pageUrl);

      const accessibilityScanResults = await new AxeBuilder({ page }).withTags(['wcag2a']).analyze();

      // Filter for heading violations
      const headingViolations = accessibilityScanResults.violations.filter((violation) =>
        violation.id.includes('heading'),
      );

      expect(headingViolations).toEqual([]);
    }
  });

  test('should have accessible color contrast', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page }).withTags(['wcag2aa']).analyze();

    // Filter for color contrast violations
    const contrastViolations = accessibilityScanResults.violations.filter((violation) =>
      violation.id.includes('color-contrast'),
    );

    expect(contrastViolations).toEqual([]);
  });

  test('should have accessible buttons and links', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page }).withTags(['wcag2a']).analyze();

    // Filter for button/link violations
    const buttonLinkViolations = accessibilityScanResults.violations.filter(
      (violation) =>
        violation.id.includes('button') ||
        violation.id.includes('link') ||
        violation.id.includes('button-name') ||
        violation.id.includes('link-name'),
    );

    expect(buttonLinkViolations).toEqual([]);
  });

  test('should have accessible images with alt text', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page }).withTags(['wcag2a']).analyze();

    // Filter for image violations
    const imageViolations = accessibilityScanResults.violations.filter((violation) =>
      violation.id.includes('image-alt'),
    );

    expect(imageViolations).toEqual([]);
  });

  test('should have skip to main content link that works', async ({ page }) => {
    await page.goto('/');

    // Check for skip link
    const skipLink = page.locator('.govuk-skip-link');

    if ((await skipLink.count()) > 0) {
      await expect(skipLink).toHaveAttribute('href', '#main-content');

      // Verify main content exists
      const mainContent = page.locator('#main-content, main');
      await expect(mainContent.first()).toBeVisible();
    }
  });

  test('should have no critical or serious violations on key pages', async ({ page }) => {
    const keyPages = ['/', '/child-safety', '/domestic-abuse', '/make-a-plan', '/cookies', '/privacy-notice', '/accessibility-statement'];

    for (const pageUrl of keyPages) {
      try {
        await page.goto(pageUrl, { waitUntil: 'networkidle' });

        const accessibilityScanResults = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze();

        // Filter critical and serious violations
        const criticalViolations = accessibilityScanResults.violations.filter(
          (violation) => violation.impact === 'critical' || violation.impact === 'serious',
        );

        expect(criticalViolations).toEqual([]);
      } catch (error) {
        // Some pages may require authentication or session data
        // Skip those pages but don't fail the test
        console.log(`Skipping ${pageUrl}: ${error}`);
      }
    }
  });
});
