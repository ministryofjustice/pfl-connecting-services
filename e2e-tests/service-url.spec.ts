import { test, expect, type Page } from '@playwright/test';

const englishServiceUrl = process.env.SERVICE_URL ?? 'http://localhost:8001';
const welshServiceUrl = process.env.SERVICE_URL_WELSH ?? 'http://localhost:8001/welsh';

const getServiceNavigationLink = (page: Page) => page.locator('.govuk-service-navigation__link');

const getBackLink = (page: Page) => page.locator('.govuk-back-link');

test.describe('Service URLs', () => {
  test.describe('layout pages', () => {
    test('should use the English service URL in the service navigation and back link when the locale is English', async ({
      page,
    }) => {
      await page.goto('/child-safety?lang=en');

      await expect(getServiceNavigationLink(page)).toHaveAttribute('href', englishServiceUrl);
      await expect(getBackLink(page)).toHaveAttribute('href', englishServiceUrl);
    });

    test('should use the Welsh service URL in the service navigation and back link when the locale is Welsh', async ({
      page,
    }) => {
      await page.goto('/child-safety?lang=cy');

      await expect(getServiceNavigationLink(page)).toHaveAttribute('href', welshServiceUrl);
      await expect(getBackLink(page)).toHaveAttribute('href', welshServiceUrl);
    });
  });

  test.describe('static pages', () => {
    test('should use the Welsh service URL in the back link when the locale is Welsh', async ({ page }) => {
      await page.goto('/cookies?lang=cy');

      await expect(getBackLink(page)).toHaveAttribute('href', welshServiceUrl);
    });
  });
});
