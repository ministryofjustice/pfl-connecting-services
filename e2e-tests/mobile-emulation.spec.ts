import { test, devices, expect, Page } from '@playwright/test';

const mobileDevices = [
  { name: 'iPhone 12', config: devices['iPhone 12'] },
  { name: 'iPhone 13', config: devices['iPhone 13'] },
  { name: 'iPhone 14', config: devices['iPhone 14'] },
  { name: 'iPad Pro 11', config: devices['iPad Pro 11'] },
  { name: 'Pixel 5', config: devices['Pixel 5'] },
  { name: 'Pixel 7', config: devices['Pixel 7'] },
  { name: 'Galaxy S8', config: devices['Galaxy S8'] },
];

async function assertNoHorizontalScroll(page: Page, url: RegExp | string) {
  await expect(page).toHaveURL(url);
  const html = await page.$('html');
  const hasHorizontalScroll = await html!.evaluate(el => el.scrollWidth > el.clientWidth);
  expect(hasHorizontalScroll).toBe(false);
}

for (const device of mobileDevices) {
  test.describe(device.name, () => {
    // isMobile is Chromium-only; strip it (and defaultBrowserType) so tests run
    // across all browsers using the correct viewport, userAgent and hasTouch settings.
    const { defaultBrowserType: _dbt, isMobile: _im, ...deviceConfig } = device.config;
    test.use(deviceConfig);

    test('Multiple Mobile Devices of different view-ports can navigate through the service', async ({ page }) => {
      await page.goto('/');
      await assertNoHorizontalScroll(page, '/');
      await page.getByRole('button', { name: /start now/i }).scrollIntoViewIfNeeded();
      await page.getByRole('button', { name: /start now/i }).tap();

      // child-safety
      await assertNoHorizontalScroll(page, /child-safety/);
      await page.getByLabel(/no/i).first().check();
      await page.getByRole('button', { name: /continue/i }).tap();

      // child-safety
      await assertNoHorizontalScroll(page, /child-safety-help/);
      await page.getByRole('button', { name: /continue/i }).tap();
      
      // domestic abuse
      await page.getByLabel(/yes/i).first().check();
      await page.getByRole('button', { name: /continue/i }).tap();

      // getting-help
      await assertNoHorizontalScroll(page, /getting-help/);
      await page.getByRole('button', { name: /continue/i }).tap();

      // contact-child-arrangements
      await assertNoHorizontalScroll(page, /contact-child-arrangements/);
      await page.getByRole('radio', { name: /I can contact them but they do not respond/i }).check();
      await page.getByRole('button', { name: /continue/i }).tap();

      // options-no-contact
      await assertNoHorizontalScroll(page, /options-no-contact/);
      await expect(page.locator('h1')).toContainText('Options to explore if you are not comfortable contacting your ex-partner');
      await page.locator('.govuk-back-link').click();

      // contact-child-arrangements
      await page.getByRole('radio', { name: /I do not have their contact details/i }).check();
      await page.getByRole('button', { name: /continue/i }).tap();

      // Court-order
      await assertNoHorizontalScroll(page, /court-order/);
      await expect(page.locator('h1')).toContainText('Explore: Applying for a court order');
      await page.locator('.govuk-back-link').click();

      // contact-child-arrangements
      await page.getByRole('radio', { name: /No, I am not comfortable contacting them/i }).check();
      await page.getByRole('button', { name: /continue/i }).tap();

      // options-no-contact
      await expect(page.locator('h1')).toContainText('Options to explore if you are not comfortable contacting your ex-partner');
      await page.locator('.govuk-back-link').click();

      // contact-child-arrangements
      await page.getByRole('radio', { name: /Yes/i }).check();
      await page.getByRole('button', { name: /continue/i }).tap();

      // agree-on-child-arrangements
      await assertNoHorizontalScroll(page, /agree/);
      await page.getByLabel(/Yes, we agree on some or most things/i).check();
      await page.getByRole('button', { name: /continue/i }).tap();

      // parenting-pan
      await assertNoHorizontalScroll(page, /parenting-plan/);
      await expect(page.locator('h1')).toContainText('Explore: Making a parenting plan');
      await page.locator('.govuk-back-link').click();

      // agree-on-child-arrangements
      await page.getByLabel(/No, we do not agree/i).check();
      await page.getByRole('button', { name: /continue/i }).tap();

      // help-to-agree
      await assertNoHorizontalScroll(page, /help-to-agree/);
      await page.getByLabel(/A plan we can follow ourselves/i).check();
      await page.getByRole('button', { name: /continue/i }).tap();

      // parenting-pan
      await expect(page.locator('h1')).toContainText('Explore: Making a parenting plan');
      await page.locator('.govuk-back-link').click();

      // help-to-agree
      await page.getByLabel(/We cannot agree – someone else needs to make a decision for us/i).check();
      await page.getByRole('button', { name: /continue/i }).tap();

      // Court-order
      await expect(page.locator('h1')).toContainText('Explore: Applying for a court order');
      await page.locator('.govuk-back-link').click();

      // help-to-agree
      await page.getByLabel(/Someone else to guide our conversations/i).check();
      await page.getByRole('button', { name: /continue/i }).tap();

      // other-options
      await assertNoHorizontalScroll(page, /other-options/);
      await page.getByLabel(/Yes, we have tried mediation or a similar method/i).check();
      await page.getByRole('button', { name: /continue/i }).tap();

      // Court-order
      await expect(page.locator('h1')).toContainText('Explore: Applying for a court order');
      await page.locator('.govuk-back-link').click();

      // other-options
      await page.getByLabel(/No, we have not tried yet/i).check();
      await page.getByRole('button', { name: /continue/i }).tap();

      // mediation
      await expect(page.locator('h1')).toContainText('Explore: Mediation');
    });
  });
}
