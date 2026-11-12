import { test, expect } from '@playwright/test';

import {
  startJourney,
  selectChildSafetyOption,
  selectDomesticAbuseOption,
  selectContactChildArrangementsOption,
} from './fixtures/test-helpers';

const pageHeading = 'Options for making arrangements through someone else';

test.beforeEach(async ({ page }) => {
  await startJourney(page);
  await selectChildSafetyOption(page, 'No');
  await selectDomesticAbuseOption(page, 'No');
  await selectContactChildArrangementsOption(page, 'I can only contact them through someone else');
});

test.describe('No contact page', () => {
  test('should display the page with correct url and title', async ({ page }) => {
    await expect(page).toHaveURL(/\/no-contact$/);
    await expect(page).toHaveTitle(new RegExp(pageHeading));
    await expect(page.locator('h1')).toContainText(pageHeading);
  });

  test('should display intro content about contacting the other parent through someone else', async ({ page }) => {
    await expect(page.locator('#main-content')).toContainText(
      'If you cannot contact the other parent directly, there are still ways to make child arrangements without going to court.',
    );
    await expect(page.locator('#main-content')).toContainText(
      'someone else (such as a mediator or solicitor) can contact them for you',
    );
  });

  test('should display shuttle mediation section with the voucher scheme', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 2, name: 'Shuttle mediation' })).toBeVisible();
    await expect(page.locator('#main-content')).toContainText(
      'sit in different rooms or online meetings so you do not have to have any contact',
    );

    const insetText = page.locator('#cost-inset-shuttle-mediation');
    await expect(insetText).toContainText('voucher worth up to £500');
    await expect(insetText.getByRole('link', { name: 'Family Mediation Voucher Scheme' })).toHaveAttribute(
      'href',
      'https://www.gov.uk/guidance/family-mediation-voucher-scheme',
    );
    await expect(page.getByRole('link', { name: 'Find out more about mediation' })).toHaveAttribute(
      'href',
      'https://www.gov.uk/looking-after-children-divorce/mediation',
    );
  });

  test('should display family solicitor negotiation and collaborative law', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 2, name: 'Family solicitor negotiation' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Find a legal adviser from the Law Society' })).toHaveAttribute(
      'href',
      'https://solicitors.lawsociety.org.uk/',
    );

    await expect(page.getByRole('heading', { level: 2, name: 'Collaborative law' })).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Find out more about collaborative law from Resolution' }),
    ).toHaveAttribute(
      'href',
      'https://resolution.org.uk/looking-for-help/splitting-up/your-process-options-for-divorce-and-dissolution/the-collaborative-process/',
    );
  });

  test('should display other ways to agree and applying for a court order', async ({ page }) => {
    await expect(
      page.getByRole('heading', { level: 2, name: 'Other ways to agree without going to court' }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Find out more about other ways to agree without going to court' }),
    ).toHaveAttribute('href', 'https://www.gov.uk/looking-after-children-divorce/non-court-dispute-resolution');

    await expect(page.getByRole('heading', { level: 2, name: 'Applying for a court order' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Explore: Applying for a court order' })).toHaveAttribute(
      'href',
      'https://connected-services-prototype.apps.live.cloud-platform.service.justice.gov.uk/public-beta-4/court',
    );
  });

  test('should display help and support list with service links', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 2, name: 'Help and support' })).toBeVisible();

    const summaryList = page.locator('.govuk-summary-list');
    await expect(summaryList.getByRole('link', { name: 'Resolution' })).toHaveAttribute(
      'href',
      'https://resolution.org.uk/find-a-law-professional',
    );
    await expect(summaryList.getByRole('link', { name: 'Advicenow' })).toHaveAttribute(
      'href',
      'https://www.advicenow.org.uk/get-help/family-and-children/child-arrangements',
    );
  });

  test('should display related content section with correct links', async ({ page }) => {
    const relatedContent = page.locator('.govuk-grid-column-one-third');
    await expect(relatedContent).toContainText('Related content');
    await expect(
      relatedContent.getByRole('link', { name: 'Making child arrangements if you divorce or separate' }),
    ).toHaveAttribute('href', 'https://www.gov.uk/looking-after-children-divorce');
    await expect(relatedContent.getByRole('link', { name: 'Family Mediation Voucher Scheme' })).toHaveAttribute(
      'href',
      'https://www.gov.uk/guidance/family-mediation-voucher-scheme',
    );
  });

  test('should display Exit this page and Print this page buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: /exit this page/i })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Print this page' })).toBeVisible();
  });

  test('should navigate to contact child arrangements page when back link is clicked', async ({ page }) => {
    await page.locator('a.govuk-back-link').click();
    await expect(page).toHaveURL(/contact-child-arrangements/);
  });

  test('should navigate to no contact guidance when "I cannot or do not want to contact them" is selected', async ({
    page,
  }) => {
    await page.locator('a.govuk-back-link').click();
    await selectContactChildArrangementsOption(page, 'I cannot or do not want to contact them');
    await expect(page).toHaveURL(/\/no-contact-guidance$/);
    await expect(page.locator('h1')).toContainText('Explore: what you can do if you cannot contact the other parent');
  });
});
