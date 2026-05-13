import { test, expect } from '@playwright/test';

test.describe('Cookies', () => {
  test('should display the page with correct title and content sections', async ({ page }) => {
    await page.goto('/cookies');

    await expect(page).toHaveTitle('Cookies – Get help finding a child arrangement option – GOV.UK');
    await expect(page.getByRole('heading', { name: 'Cookies', exact: true })).toBeVisible();

    await expect(page.getByText('Cookies are used to:')).toBeVisible();
    await expect(page.getByText('remember your progress')).toBeVisible();
    await expect(page.getByText('measure how you use the service so it can be updated and improved based on your needs')).toBeVisible();

    await expect(page.getByRole('heading', { name: /How cookies are used in this service/i, exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Essential cookies/i, exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Remembering your progress/i, exact: true })).toBeVisible();
    await expect(page.getByText('We will store cookies to remember your application progress in this computer and to expire your session after 30 minutes of inactivity or when you close your browser.')).toBeVisible();

    const cookieTable = page.locator('table').first();
    await expect(cookieTable.getByText('Name')).toBeVisible();
    await expect(cookieTable.getByText('Saves your current progress in this computer and tracks inactivity periods')).toBeVisible();
    await expect(cookieTable.getByText('After 30 minutes of inactivity or when you close your browser')).toBeVisible();

    await expect(page.getByRole('link', { name: /Find out more about how to manage cookies/i })).toHaveAttribute(
      'href',
      'https://www.aboutcookies.org/'
    );
  });

  test('should not display analytics cookie settings when analytics is disabled', async ({ page }) => {
    await page.goto('/cookies');

    await expect(page.getByRole('heading', { name: /Analytics cookies/i })).toHaveCount(0);
    await expect(page.getByRole('button', { name: /Save cookie settings/i })).toHaveCount(0);
    await expect(page.getByRole('radio', { name: /Yes/i })).toHaveCount(0);
    await expect(page.getByRole('radio', { name: /No/i })).toHaveCount(0);
  });

  test('should navigate to aboutcookies.org external website', async ({ page }) => {
    await page.goto('/cookies');

    await page.getByRole('link', { name: /Find out more about how to manage cookies/i }).click();

    await expect(page).toHaveURL('https://www.aboutcookies.org/');
  });
});
