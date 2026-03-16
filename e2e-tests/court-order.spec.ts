import { test, expect } from '@playwright/test';

import {
  startJourney,
  selectChildSafetyOption,
  selectDomesticAbuseOption,
  selectContactChildArrangementsOption,
  selectAgreeOnChildArrangementsOption,
  selectHelpToAgreeOnChildArrangementsOption,
  selectOtherOptions,
} from './fixtures/test-helpers';

test.describe('Court Order Page', () => {
  test.beforeEach(async ({ page }) => {
    await startJourney(page);
    await selectChildSafetyOption(page, 'Yes');
    await selectDomesticAbuseOption(page, 'No');
    await selectContactChildArrangementsOption(page, 'I do not have their contact details');
  });

  test('should display the page with correct url and title', async ({ page }) => {
    await expect(page).toHaveURL(/court-order/);
    await expect(page.locator('h1')).toContainText('Explore: Applying for a court order');
  });

  test('should display "Why this could be right for you" section', async ({ page }) => {
    await expect(page.locator('h2').first()).toHaveText('Why this could be right for you');
    await expect(page.locator('.govuk-list--bullet').first()).toContainText('you cannot agree after');
    await expect(page.locator('.govuk-list--bullet').first()).toContainText('domestic or any other kind of abuse');
  });

  test('should display "Important things to consider" section', async ({ page }) => {
    await expect(page.locator('text=Important things to consider')).toBeVisible();
    await expect(page.locator('text=Mediation:')).toBeVisible();
    await expect(page.locator('text=Cost:')).toBeVisible();
    await expect(page.locator('text=Time:')).toBeVisible();
  });

  test('should display "Other ways to agree" section', async ({ page }) => {
    await expect(page.locator('h2:has-text("Other ways to agree without going to court")')).toBeVisible();
    await expect(page.locator('h3:has-text("Mediation")')).toBeVisible();
    await expect(page.locator('h3:has-text("Arbitration")')).toBeVisible();
  });

  test('should display mediation voucher inset text', async ({ page }) => {
    await expect(page.locator('.govuk-inset-text')).toContainText('voucher worth up to £500');
  });

  test('should display help and support table with services', async ({ page }) => {
    await expect(page.locator('text=Help and support')).toBeVisible();
    await expect(page.locator('.govuk-table')).toContainText('Advice Now');
    await expect(page.locator('.govuk-table')).toContainText('Cafcass');
    await expect(page.locator('.govuk-table')).toContainText('Cafcass Cymru');
  });

  test('should display related content section', async ({ page }) => {
    const relatedContent = page.locator('.govuk-prototype-kit-common-templates-related-items');
    await expect(relatedContent).toContainText('Related content');
    await expect(relatedContent).toContainText('Making child arrangements if you divorce or separate');
    await expect(relatedContent).toContainText('Apply for a court order');
    await expect(relatedContent).toContainText('Parental rights and responsibilities');
  });

  test('should display Exit this page button', async ({ page }) => {
    await expect(page.locator('text=Exit this page')).toBeVisible();
  });

  test('should display Print this page button', async ({ page }) => {
    await expect(page.locator('button:has-text("Print this page")')).toBeVisible();
  });

  test('should have Advice Now link pointing to correct URL', async ({ page }) => {
    const adviceNowLink = page.locator('a:has-text("Advice Now")');
    await expect(adviceNowLink).toHaveAttribute(
      'href',
      'https://www.advicenow.org.uk/get-help/family-and-children/child-arrangements/what-do-you-apply-family-court-about-your-children',
    );
  });

  test('should have Cafcass link pointing to correct URL', async ({ page }) => {
    const cafcassLink = page.locator('a:has-text("Children and Family Court Advisory and Support Service (Cafcass)")');
    await expect(cafcassLink).toHaveAttribute(
      'href',
      'https://www.cafcass.gov.uk/parent-carer-or-family-member/my-family-involved-private-law-proceedings/court-process-and-what-expect',
    );
  });

  test('should have Cafcass Cymru link pointing to correct URL', async ({ page }) => {
    const cafcassCymruLink = page.locator('a:has-text("Cafcass Cymru")');
    await expect(cafcassCymruLink).toHaveAttribute(
      'href',
      'https://www.gov.wales/cafcass-cymru/family-separation/information-for-parents',
    );
  });

  test('should have related content links pointing to correct URLs', async ({ page }) => {
    const relatedContent = page.locator('.govuk-prototype-kit-common-templates-related-items');

    const makingArrangementsLink = relatedContent.locator(
      'a:has-text("Making child arrangements if you divorce or separate")',
    );
    await expect(makingArrangementsLink).toHaveAttribute('href', 'https://www.gov.uk/looking-after-children-divorce');

    const applyForOrderLink = relatedContent.locator('a:has-text("Apply for a court order")');
    await expect(applyForOrderLink).toHaveAttribute(
      'href',
      'https://www.gov.uk/looking-after-children-divorce/apply-for-court-order',
    );

    const parentalRightsLink = relatedContent.locator('a:has-text("Parental rights and responsibilities")');
    await expect(parentalRightsLink).toHaveAttribute('href', 'https://www.gov.uk/parental-rights-responsibilities');
  });

  test('should have mediation link pointing to internal mediation page', async ({ page }) => {
    const mediationLink = page.locator('a:has-text("Explore: Mediation")');
    await expect(mediationLink).toHaveAttribute('href', '/mediation');
  });
});

test.describe('should display explore court order through different journey flows.', () => {
  test.beforeEach(async ({ page }) => {
    await startJourney(page);
    await selectChildSafetyOption(page, 'Yes');
    await selectDomesticAbuseOption(page, 'No');
    await selectContactChildArrangementsOption(page, 'Yes');
  });

  test('should display explore a court order when parent and ex-partner need someone else to make a decision on child arrangements', async ({
    page,
  }) => {
    await selectAgreeOnChildArrangementsOption(page, 'No, we do not agree');
    await selectHelpToAgreeOnChildArrangementsOption(
      page,
      'We cannot agree – someone else needs to make a decision for us',
    );

    await expect(page).toHaveURL(/court-order/);
    await expect(page.locator('h1')).toContainText('Explore: Applying for a court order');
  });

  test('should display explore a court order when parent and ex-partner have tried one or more other options', async ({
    page,
  }) => {
    await selectAgreeOnChildArrangementsOption(page, 'No, we do not agree');
    await selectHelpToAgreeOnChildArrangementsOption(page, 'Someone else to guide our conversations');
    await selectOtherOptions(page, 'Yes, we have tried mediation or a similar method');

    await expect(page).toHaveURL(/court-order/);
    await expect(page.locator('h1')).toContainText('Explore: Applying for a court order');
  });

  test('should display explore a court order when parent and ex-partner have not discussed child arrangements and need someone else to make a decision on child arrangements', async ({
    page,
  }) => {
    await selectAgreeOnChildArrangementsOption(page, 'We have not discussed it yet');
    await selectHelpToAgreeOnChildArrangementsOption(
      page,
      'We cannot agree – someone else needs to make a decision for us',
    );

    await expect(page).toHaveURL(/court-order/);
    await expect(page.locator('h1')).toContainText('Explore: Applying for a court order');
  });

  test('should display explore a court order when parent and ex-partner have not discussed child arrangements and have tried one or more other options', async ({
    page,
  }) => {
    await selectAgreeOnChildArrangementsOption(page, 'We have not discussed it yet');
    await selectHelpToAgreeOnChildArrangementsOption(page, 'Someone else to guide our conversations');
    await selectOtherOptions(page, 'Yes, we have tried mediation or a similar method');

    await expect(page).toHaveURL(/court-order/);
    await expect(page.locator('h1')).toContainText('Explore: Applying for a court order');
  });
});
