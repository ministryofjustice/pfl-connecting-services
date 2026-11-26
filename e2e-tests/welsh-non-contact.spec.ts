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
    await expect(page.locator('h1')).toContainText("Pa un o'r rhain sy'n disgrifio cyswllt â'r rhiant arall orau?");
    await expect(page.getByRole('radio', { name: "Gallaf gysylltu â nhw'n uniongyrchol", exact: true })).toBeVisible();
    await expect(
      page.getByRole('radio', { name: 'Dim ond trwy rywun arall y gallaf gysylltu â nhw', exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole('radio', { name: 'Ni allaf, neu nid wyf am gysylltu â nhw', exact: true }),
    ).toBeVisible();
    await expect(page.locator('.govuk-radios__divider')).toHaveText('neu');
    await expect(page).toHaveTitle(/Cael help i ddod o hyd i opsiwn trefniant plant/);
  });

  test('should show a Welsh validation error when no contact option is selected', async ({ page }) => {
    await page.getByRole('button', { name: 'Parhau' }).click();

    await expect(page.locator('.govuk-error-summary')).toContainText(
      "Dewiswch pa un sy'n disgrifio cyswllt â'r rhiant arall orau",
    );
  });

  test('should display the through someone else page in Welsh', async ({ page }) => {
    await page.getByRole('radio', { name: 'Dim ond trwy rywun arall y gallaf gysylltu â nhw', exact: true }).check();
    await page.getByRole('button', { name: 'Parhau' }).click();

    await expect(page).toHaveURL(/\/through-someone-else$/);
    await expect(page.locator('h1')).toContainText('Options for making arrangements through someone else');
    await expect(page.locator('#main-content')).toContainText(
      'If you cannot contact or do not want to contact the other parent directly, there are still ways to make child arrangements without going to court.',
    );
    await expect(page.getByRole('heading', { level: 2, name: 'Cyfryngu gwennol' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Negodi gyda chyfreithiwr teulu' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Cyfraith gydweithredol' })).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 2, name: "Ffyrdd eraill i gytuno heb fynd i'r llys" }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Cymorth a chefnogaeth' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Rhagor o wybodaeth am gyfryngu' })).toHaveAttribute(
      'href',
      'https://www.gov.uk/looking-after-children-divorce/mediation',
    );
    await expect(page.getByRole('button', { name: 'Argraffu’r dudalen hon' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Gadael y dudalen hon' })).toBeVisible();
    await expect(page.locator('a.govuk-back-link')).toHaveText('Yn ol');
  });

  test('should display the no contact page in Welsh', async ({ page }) => {
    await page.getByRole('radio', { name: 'Ni allaf, neu nid wyf am gysylltu â nhw', exact: true }).check();
    await page.getByRole('button', { name: 'Parhau' }).click();

    await expect(page).toHaveURL(/\/no-contact$/);
    await expect(page.locator('h1')).toContainText(
      "Archwilio: beth allwch ei wneud os na allwch gysylltu â'r rhiant arall",
    );
    await expect(page.locator('#main-content')).toContainText(
      "Os na allwch gysylltu â'r rhiant arall neu os nad ydynt yn ymateb, mae ffyrdd eraill o gael help gyda threfniadau ar gyfer eich plentyn.",
    );
    await expect(page.locator('.govuk-warning-text')).toContainText(
      "Peidiwch â chysylltu â'r rhiant arall os gallai gwneud hynny eich rhoi chi neu'ch plentyn mewn perygl neu olygu torri gorchymyn llys.",
    );
    await expect(page.getByRole('heading', { level: 2, name: 'Gwneud trefniadau plant' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Cael cynhaliaeth plant' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: "Gwneud cais i'r llys" })).toBeVisible();
    await expect(page.locator('table caption').first()).toHaveText('Mathau o orchmynion llys');
    await expect(page.getByRole('link', { name: 'Cynnig cynllun trefniadau plant' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Gadael y dudalen hon' })).toBeVisible();
  });
});
