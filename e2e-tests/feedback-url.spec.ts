import { test, expect, type Page } from '@playwright/test';

const englishFeedbackUrl = process.env.FEEDBACK_URL ?? 'https://feedback.example.com/english';
const welshFeedbackUrl = process.env.FEEDBACK_URL_WELSH ?? 'https://feedback.example.com/welsh';

const getFooterFeedbackLink = (page: Page) =>
  page.locator('.govuk-footer').getByRole('link', { name: /^(Feedback|Adborth)$/i });

const getPhaseBannerFeedbackLink = (page: Page) => page.locator('.govuk-phase-banner').getByRole('link');

test.describe('Feedback URLs', () => {
  test.describe('start page footer', () => {
    test('should use the English feedback URL when the locale is English', async ({ page }) => {
      await page.goto('/?lang=en');

      await expect(getFooterFeedbackLink(page)).toHaveAttribute('href', englishFeedbackUrl);
    });

    test('should use the Welsh feedback URL when the locale is Welsh', async ({ page }) => {
      await page.goto('/?lang=cy');

      await expect(getFooterFeedbackLink(page)).toHaveAttribute('href', welshFeedbackUrl);
    });
  });

  test.describe('layout pages', () => {
    test('should use the English feedback URL in the phase banner and footer when the locale is English', async ({
      page,
    }) => {
      await page.goto('/child-safety?lang=en');

      await expect(getPhaseBannerFeedbackLink(page)).toHaveAttribute('href', englishFeedbackUrl);
      await expect(getFooterFeedbackLink(page)).toHaveAttribute('href', englishFeedbackUrl);
    });

    test('should use the Welsh feedback URL in the phase banner and footer when the locale is Welsh', async ({
      page,
    }) => {
      await page.goto('/child-safety?lang=cy');

      await expect(getPhaseBannerFeedbackLink(page)).toHaveAttribute('href', welshFeedbackUrl);
      await expect(getFooterFeedbackLink(page)).toHaveAttribute('href', welshFeedbackUrl);
    });
  });
});
