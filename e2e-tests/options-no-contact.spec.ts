import { test, expect } from '@playwright/test';

import {
  startJourney,
  selectChildSafetyOption,
  selectDomesticAbuseOption,
  selectContactChildArrangementsOption,
} from './fixtures/test-helpers';

const pageTitle = 'Explore: what you can do if you cannot contact the other parent';

test.beforeEach(async ({ page }) => {
  await startJourney(page);
  await selectChildSafetyOption(page, 'No');
  await selectDomesticAbuseOption(page, 'No');
  await selectContactChildArrangementsOption(page, 'I cannot or do not want to contact them');
});

test.describe('No contact guidance page', () => {
  test('should display the page with correct url and title', async ({ page }) => {
    await expect(page).toHaveURL(/\/no-contact-guidance$/);
    await expect(page).toHaveTitle(new RegExp(pageTitle));
    await expect(page.locator('h1')).toContainText(pageTitle);
  });

  test('should display intro content and what the page explains', async ({ page }) => {
    await expect(page.locator('#main-content')).toContainText(
      'If you cannot contact the other parent or they do not respond, there are other ways to get help with arrangements for your child.',
    );
    await expect(page.locator('#main-content')).toContainText('This page explains how you can:');

    const list = page.locator('ul.govuk-list--bullet');
    await expect(list).toContainText('get help making child arrangements');
    await expect(list).toContainText('get child maintenance');
    await expect(list).toContainText('apply to court if you need the court to make a decision');
  });

  test('should display warning text about contacting the other parent', async ({ page }) => {
    const warningText = page.locator('.govuk-warning-text');
    await expect(warningText).toBeVisible();
    await expect(warningText).toContainText(
      'Do not contact the other parent if doing so could put you or your child at risk or could mean breaking a court order.',
    );
  });

  test('should display make child arrangements section with the correct link', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 2, name: 'Make child arrangements' })).toBeVisible();
    await expect(page.locator('#main-content')).toContainText(
      'a legal adviser may be able to contact the other parent on your behalf',
    );

    const link = page.getByRole('link', { name: 'Find out about making child arrangements' });
    await expect(link).toHaveAttribute('href', 'https://www.gov.uk/looking-after-children-divorce');
  });

  test('should display get child maintenance section with the correct link', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 2, name: 'Get child maintenance' })).toBeVisible();
    await expect(page.locator('#main-content')).toContainText(
      'You can use the Child Maintenance Service if you cannot agree child maintenance with the other parent.',
    );

    const link = page.getByRole('link', { name: 'Find out about the Child Maintenance Service' });
    await expect(link).toHaveAttribute('href', 'https://www.gov.uk/child-maintenance-service');
  });

  test('should display apply to court guidance', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 2, name: 'Apply to court' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 3, name: 'Before you apply to court' })).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 3, name: 'Find out who has parental responsibility' }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { level: 3, name: 'Check which court order you may need' })).toBeVisible();
    await expect(page.locator('#main-content')).toContainText(
      'Being unable to contact the other parent is not, on its own, a reason not to attend a MIAM.',
    );

    await expect(page.getByRole('link', { name: 'Check if you do not need to attend a MIAM' })).toHaveAttribute(
      'href',
      'https://apply-to-court-about-child-arrangements.service.justice.gov.uk/about/miam_exemptions',
    );
    await expect(
      page.getByRole('link', { name: 'Find out about parental rights and responsibilities' }),
    ).toHaveAttribute('href', 'https://www.gov.uk/parental-rights-responsibilities');
    await expect(page.getByRole('link', { name: 'Find out about applying for a court order' })).toHaveAttribute(
      'href',
      'https://www.gov.uk/looking-after-children-divorce/apply-for-court-order',
    );
  });

  test('should display types of court order table', async ({ page }) => {
    const table = page.locator('table.govuk-table').first();

    await expect(table.locator('caption')).toHaveText('Types of court order');
    await expect(table).toContainText('If you need help with');
    await expect(table).toContainText('Child arrangements order');
    await expect(table).toContainText('Where your child lives or who they spend time with');
    await expect(table).toContainText("A decision about your child's education");
    await expect(table).toContainText('Taking your child abroad');
    await expect(table).toContainText('Getting a passport for your child');
    await expect(table).toContainText('Prohibited steps order');
    await expect(table).toContainText('Stopping the other parent from doing something');
  });

  test('should display help and support table with service links', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 2, name: 'Help and support' })).toBeVisible();

    const table = page.locator('table.govuk-table').nth(1);
    await expect(table).toContainText('Organisation');
    await expect(table).toContainText('How they can help');
    await expect(table.getByRole('link', { name: 'Separated Parenting Programme Directory' })).toHaveAttribute(
      'href',
      'https://separatedparentingprogrammedirectory.org/',
    );
    await expect(table.getByRole('link', { name: 'Refuge National Domestic Abuse Helpline' })).toHaveAttribute(
      'href',
      'https://www.nationaldahelpline.org.uk/',
    );
    await expect(table.getByRole('link', { name: '0808 2000 247' })).toHaveAttribute('href', 'tel:0808 2000 247');
    await expect(table.getByRole('link', { name: 'Rights of Women' })).toHaveAttribute(
      'href',
      'https://www.rightsofwomen.org.uk/get-advice/family-law/',
    );
    await expect(table.getByRole('link', { name: '020 7251 6577' })).toHaveAttribute('href', 'tel:020 7251 6577');
    await expect(table.getByRole('link', { name: "Men's Advice Line" })).toHaveAttribute(
      'href',
      'https://mensadviceline.org.uk/',
    );
    await expect(table.getByRole('link', { name: '0808 801 0327' })).toHaveAttribute('href', 'tel:0808 801 0327');
  });

  test('should display related content section with correct links', async ({ page }) => {
    const relatedContent = page.locator('.govuk-grid-column-one-third');
    await expect(relatedContent).toContainText('Related content');

    await expect(relatedContent.getByRole('link', { name: 'Propose a child arrangements plan' })).toHaveAttribute(
      'href',
      'https://connected-services-prototype.apps.live.cloud-platform.service.justice.gov.uk/public-beta-4/no-contact-guidance#',
    );
    await expect(
      relatedContent.getByRole('link', { name: 'Making child arrangements if you divorce or separate' }),
    ).toHaveAttribute('href', 'https://www.gov.uk/looking-after-children-divorce');
    await expect(relatedContent.getByRole('link', { name: 'Apply for a court order' })).toHaveAttribute(
      'href',
      'https://www.gov.uk/looking-after-children-divorce/apply-for-court-order',
    );
    await expect(relatedContent.getByRole('link', { name: 'Parental rights and responsibilities' })).toHaveAttribute(
      'href',
      'https://www.gov.uk/parental-rights-responsibilities',
    );
  });

  test('should display back to top links', async ({ page }) => {
    const backToTopLinks = page.locator('a[href="#top"]');
    await expect(backToTopLinks).toHaveCount(4);
    await expect(backToTopLinks.first()).toContainText('Back to top');
  });

  test('should display Exit this page button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /exit this page/i })).toBeVisible();
  });

  test('should navigate to contact child arrangements page when back link is clicked', async ({ page }) => {
    await page.locator('a.govuk-back-link').click();
    await expect(page).toHaveURL(/contact-child-arrangements/);
  });

  test('should navigate to agree when "I can contact them directly" is selected', async ({ page }) => {
    await page.locator('a.govuk-back-link').click();
    await selectContactChildArrangementsOption(page, 'I can contact them directly');
    await expect(page).toHaveURL(/agree/);
    await expect(page.locator('h1')).toContainText('Do you and your ex-partner agree on child arrangements?');
  });

  test('should navigate to no contact page when "I can only contact them through someone else" is selected', async ({
    page,
  }) => {
    await page.locator('a.govuk-back-link').click();
    await selectContactChildArrangementsOption(page, 'I can only contact them through someone else');
    await expect(page).toHaveURL(/\/no-contact$/);
    await expect(page.locator('h1')).toContainText('Options for making arrangements through someone else');
  });
});
