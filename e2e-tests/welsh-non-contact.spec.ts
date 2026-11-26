import { test, expect } from '@playwright/test';

test.describe('Welsh non-contact pages', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?lang=cy');
    await page.getByRole('button', { name: /start now/i }).click();
    await page.getByRole('radio', { name: 'Nac ydyn', exact: true }).check();
    await page.getByRole('button', { name: 'Parhau' }).click();
    await page.getByRole('radio', { name: 'Nac ydw', exact: true }).check();
    await page.getByRole('button', { name: 'Parhau' }).click();
    await expect(page).toHaveURL(/contact-child-arrangements/);
  });

  test('should display the contact question in Welsh', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Which of these best describes contact with the other parent?');
    await expect(page.getByRole('radio', { name: 'I can contact them directly', exact: true })).toBeVisible();
    await expect(
      page.getByRole('radio', { name: 'I can only contact them through someone else', exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole('radio', { name: 'I cannot or do not want to contact them', exact: true }),
    ).toBeVisible();
    await expect(page.locator('.govuk-radios__divider')).toHaveText('or');
    await expect(page).toHaveTitle(/Cael help i ddod o hyd i opsiwn trefniant plant/);
  });

  test('should show a Welsh validation error when no contact option is selected', async ({ page }) => {
    await page.getByRole('button', { name: 'Parhau' }).click();

    await expect(page.locator('.govuk-error-summary')).toContainText(
      'Select which of these best describes contact with the other parent',
    );
  });

  test('should display the through someone else page in Welsh', async ({ page }) => {
    await page.getByRole('radio', { name: 'I can only contact them through someone else', exact: true }).check();
    await page.getByRole('button', { name: 'Parhau' }).click();

    await expect(page).toHaveURL(/\/through-someone-else$/);
    await expect(page.locator('h1')).toContainText('Options for making arrangements through someone else');
    await expect(page.locator('#main-content')).toContainText(
      'If you cannot contact the other parent directly, there are still ways to make child arrangements without going to court.',
    );
    await expect(page.getByRole('heading', { level: 2, name: 'Shuttle mediation' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Family solicitor negotiation' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Collaborative law' })).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 2, name: 'Other ways to agree without going to court' }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Help and support' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Find out more about mediation' })).toHaveAttribute(
      'href',
      'https://www.gov.uk/looking-after-children-divorce/mediation',
    );
    await expect(page.getByRole('button', { name: 'Argraffu’r dudalen hon' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Gadael y dudalen hon' })).toBeVisible();
    await expect(page.locator('a.govuk-back-link')).toHaveText('Yn ol');
  });

  test('should display the no contact page in Welsh', async ({ page }) => {
    await page.getByRole('radio', { name: 'I cannot or do not want to contact them', exact: true }).check();
    await page.getByRole('button', { name: 'Parhau' }).click();

    await expect(page).toHaveURL(/\/no-contact$/);
    await expect(page.locator('h1')).toContainText('Explore: what you can do if you cannot contact the other parent');
    await expect(page.locator('#main-content')).toContainText(
      'If you cannot contact the other parent or they do not respond, there are other ways to get help with arrangements for your child.',
    );
    await expect(page.locator('.govuk-warning-text')).toContainText(
      'Do not contact the other parent if doing so could put you or your child at risk or could mean breaking a court order.',
    );
    await expect(page.getByRole('heading', { level: 2, name: 'Make child arrangements' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Get child maintenance' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Apply to court' })).toBeVisible();
    await expect(page.locator('table caption').first()).toHaveText('Types of court order');
    await expect(page.getByRole('link', { name: 'Propose a child arrangements plan' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Gadael y dudalen hon' })).toBeVisible();
  });
});
