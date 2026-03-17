import { test, expect } from '@playwright/test';

import { startJourney, selectChildSafetyOption, selectDomesticAbuseOption, selectContactChildArrangementsOption, selectAgreeOnChildArrangementsOption, selectHelpToAgreeOnChildArrangementsOption, selectOtherOptions} from './fixtures/test-helpers';

test.describe('Court Order Page', () => {

  test.beforeEach(async ({ page }) => {
    await startJourney(page);
    await selectChildSafetyOption(page, 'Yes');
    await selectDomesticAbuseOption(page, "No");
    await selectContactChildArrangementsOption(page, 'Yes');
    await selectAgreeOnChildArrangementsOption(page, 'No, we do not agree');
    await selectHelpToAgreeOnChildArrangementsOption(page, 'Someone else to guide our conversations');
    await selectOtherOptions(page, 'No, we have not tried yet')
  });

  test('should display the page with correct url and title', async ({ page }) => {
    await expect(page).toHaveURL(/mediation/);
    await expect(page.locator('h1')).toContainText('Explore: Mediation');
  });

  test('should display "Why this could be right for you" section', async ({ page }) => {
    await expect(page.locator('h2').nth(0)).toHaveText('Why this could be right for you');
  });

  test('should display "Important things to consider" section', async ({ page }) => {
    await expect(page.locator('h2').nth(1)).toHaveText('Important things to consider');
    await expect(page.locator('text=Initial meeting:')).toBeVisible();
    await expect(page.locator('text=Cost:')).toBeVisible();
    await expect(page.locator('.govuk-inset-text')).toContainText('voucher worth up to £500');
    await expect(page.locator('text=You stay in control:')).toBeVisible();
    await expect(page.locator('text=Child-inclusive mediation:')).toBeVisible();
    await expect(page.locator('text=Court is still an option:')).toBeVisible();
  });

  test('should display "Other ways to agree" section', async ({ page }) => {
    await expect(page.locator('h2:has-text("Other ways to agree without going to court")')).toBeVisible();
    await expect(page.locator('h3:has-text("Making a parenting plan")')).toBeVisible();
    await expect(page.locator('h3:has-text("Other options to explore")')).toBeVisible();
  });

   test('should display help and support table with services', async ({ page }) => {
    await expect(page.locator('text=Help and support')).toBeVisible();
    await expect(page.locator('.govuk-summary-list')).toContainText('Family Mediation Council');
    await expect(page.locator('.govuk-summary-list')).toContainText('Find a legal aid adviser or family mediator');
  });

   test('should display related content section', async ({ page }) => {
     const relatedContent = page.locator('nav[role="navigation"]');
     await expect(relatedContent).toContainText('Making child arrangements if you divorce or separate');
     await expect(relatedContent).toContainText('Family Mediation Voucher Scheme');
  });

  test('should have related content links pointing to correct URLs', async ({ page }) => {
    const relatedContent = page.locator('nav[role="navigation"]');
    
    const makingArrangementsLink = relatedContent.locator('a:has-text("Making child arrangements if you divorce or separate")');
    await expect(makingArrangementsLink).toHaveAttribute('href', 'https://www.gov.uk/looking-after-children-divorce');

    const mediationVoucherLink = relatedContent.locator('a:has-text("Family Mediation Voucher Scheme")');
    await expect(mediationVoucherLink).toHaveAttribute('href', 'https://www.gov.uk/guidance/family-mediation-voucher-scheme');
  });

  test('should display Exit this page button', async ({ page }) => {
    await expect(page.locator('text=Exit this page')).toBeVisible();
  });

  test('should display Print this page button', async ({ page }) => {
    await expect(page.locator('button:has-text("Print this page")')).toBeVisible();
  });

  test('should have Advice Now link pointing to correct URL', async ({ page }) => {
    const FamilyMediationCouncilLink = page.locator('a:has-text("Family Mediation Council")');
    await expect(FamilyMediationCouncilLink).toHaveAttribute('href', 'https://www.familymediationcouncil.org.uk/');
  });

  test('should have Cafcass link pointing to correct URL', async ({ page }) => {
    const FindLegalAdviceLink = page.locator('a:has-text("Find a legal aid adviser or family mediator")');
    await expect(FindLegalAdviceLink).toHaveAttribute('href', 'https://find-legal-advice.justice.gov.uk/');
  });
});
