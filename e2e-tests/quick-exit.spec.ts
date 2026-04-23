import { test, expect, Page } from '@playwright/test';

import { startJourney, selectChildSafetyOption, selectDomesticAbuseOption, selectContactChildArrangementsOption, selectAgreeOnChildArrangementsOption, selectHelpToAgreeOnChildArrangementsOption, selectOtherOptions} from './fixtures/test-helpers';

async function clickExitButton(page: Page) {
  const exit = page.getByRole('button', { name: /exit this page/i });
  await expect(exit).toBeVisible();
  await exit.click();
}

async function assertNavigationToBBCWeather(page: Page, url: RegExp) {
  await page.goto('https://www.bbc.co.uk/weather');
  await expect(page).not.toHaveURL(url);
  await expect(page).toHaveURL(/bbc\.(co\.uk|com)\/weather/);
}

test.describe('Exit the page from child safety page', () => {
  test('Page should navigate to BBC Weather when "Exit this page" is clicked, and not have the URL I navigated from.', async ({ page }) => {
    await startJourney(page)
    await expect(page).toHaveURL(/child-safety/i);

    await clickExitButton(page);
    await assertNavigationToBBCWeather(page, /child-safety/)
  });
});

test.describe('Exit the page from children not safe page', () => {
  test('Page should navigate to BBC Weather when "Exit this page" is clicked, and not have the URL I navigated from.', async ({ page }) => {
    await startJourney(page)
    await selectChildSafetyOption(page, 'No')
    await expect(page).toHaveURL(/child-safety-help/i);

    await clickExitButton(page);
    await assertNavigationToBBCWeather(page, /child-safety-help/)
  });
});

test.describe('Exit the page from the domestic abuse page', () => {
  test('Page should navigate to BBC Weather when "Exit this page" is clicked, and not have the URL I navigated from.', async ({ page }) => {
    await startJourney(page)
    await selectChildSafetyOption(page, 'Yes')
    await expect(page).toHaveURL(/domestic-abuse/i);

    await clickExitButton(page);
    await assertNavigationToBBCWeather(page, /domestic-abuse/)
  });
});

test.describe('Exit the page from getting help page', () => {
  test('Page should navigate to BBC Weather when "Exit this page" is clicked, and not have the URL I navigated from..', async ({ page }) => {
    await startJourney(page)
    await selectChildSafetyOption(page, 'Yes')
    await selectDomesticAbuseOption(page, 'Yes')
    await expect(page).toHaveURL(/getting-help/i);

    await clickExitButton(page);
    await assertNavigationToBBCWeather(page, /getting-help/)
  });
});

test.describe('Exit the page from contact child arrangements page', () => {
  test('Page should navigate to BBC Weather when "Exit this page" is clicked, and not have the URL I navigated from..', async ({ page }) => {
    await startJourney(page)
    await selectChildSafetyOption(page, 'Yes')
    await selectDomesticAbuseOption(page, 'No')
    await expect(page).toHaveURL(/contact-child-arrangements/i);

    await clickExitButton(page);
    await assertNavigationToBBCWeather(page, /contact-child-arrangements/)
  });
});

test.describe('Exit the page from the options no contact page', () => {
  test('Page should navigate to BBC Weather when "Exit this page" is clicked, and not have the URL I navigated from..', async ({ page }) => {
    await startJourney(page)
    await selectChildSafetyOption(page, 'Yes')
    await selectDomesticAbuseOption(page, 'No')
    await selectContactChildArrangementsOption(page, 'I can contact them but they do not respond')
    await expect(page).toHaveURL(/court-order/i);

    await clickExitButton(page);
    await assertNavigationToBBCWeather(page, /court-order/)
  });
});

test.describe('Exit the page from explore a court order page', () => {
  test('Page should navigate to BBC Weather when "Exit this page" is clicked, and not have the URL I navigated from..', async ({ page }) => {
    await startJourney(page)
    await selectChildSafetyOption(page, 'Yes')
    await selectDomesticAbuseOption(page, 'No')
    await selectContactChildArrangementsOption(page, 'I do not have their contact details')
    await expect(page).toHaveURL(/court-order/i);

    await clickExitButton(page);
    await assertNavigationToBBCWeather(page, /court-order/)
  });
});

test.describe('Exit the page from the agree on child arrangements page', () => {
  test('Page should navigate to BBC Weather when "Exit this page" is clicked, and not have the URL I navigated from..', async ({ page }) => {
    await startJourney(page)
    await selectChildSafetyOption(page, 'Yes')
    await selectDomesticAbuseOption(page, 'No')
    await selectContactChildArrangementsOption(page, 'Yes')
    await expect(page).toHaveURL(/agree/i);

    await clickExitButton(page);
    await assertNavigationToBBCWeather(page, /agree/)
  });
});

test.describe('Exit the page from explore making a parenting plan page', () => {
  test('Page should navigate to BBC Weather when "Exit this page" is clicked, and not have the URL I navigated from..', async ({ page }) => {
    await startJourney(page)
    await selectChildSafetyOption(page, 'Yes')
    await selectDomesticAbuseOption(page, 'No')
    await selectContactChildArrangementsOption(page, 'Yes')
    await selectAgreeOnChildArrangementsOption(page, 'Yes, we agree on some or most things')
    await expect(page).toHaveURL(/parenting-plan/i);

    await clickExitButton(page);
    await assertNavigationToBBCWeather(page, /parenting-plan/)
  });
});

test.describe('Exit the page from the help to agree on child arrangements page', () => {
  test('Page should navigate to BBC Weather when "Exit this page" is clicked, and not have the URL I navigated from..', async ({ page }) => {
    await startJourney(page)
    await selectChildSafetyOption(page, 'Yes')
    await selectDomesticAbuseOption(page, 'No')
    await selectContactChildArrangementsOption(page, 'Yes')
    await selectAgreeOnChildArrangementsOption(page, 'We have not discussed it yet')
    await expect(page).toHaveURL(/help-to-agree/i);

    await clickExitButton(page);
    await assertNavigationToBBCWeather(page, /help-to-agree/)
  });
});

test.describe('Exit the page from the other options page', () => {
  test('Page should navigate to BBC Weather when "Exit this page" is clicked, and not have the URL I navigated from..', async ({ page }) => {
    await startJourney(page)
    await selectChildSafetyOption(page, 'Yes')
    await selectDomesticAbuseOption(page, 'No')
    await selectContactChildArrangementsOption(page, 'Yes')
    await selectAgreeOnChildArrangementsOption(page, 'No, we do not agree')
    await selectHelpToAgreeOnChildArrangementsOption(page, 'Someone else to guide our conversations')
    await expect(page).toHaveURL(/other-options/i);

    await clickExitButton(page);
    await assertNavigationToBBCWeather(page, /other-options/)
  });
});

test.describe('Exit the page from explore mediation page', () => {
  test('Page should navigate to BBC Weather when "Exit this page" is clicked, and not have the URL I navigated from..', async ({ page }) => {
    await startJourney(page)
    await selectChildSafetyOption(page, 'Yes')
    await selectDomesticAbuseOption(page, 'No')
    await selectContactChildArrangementsOption(page, 'Yes')
    await selectAgreeOnChildArrangementsOption(page, 'No, we do not agree')
    await selectHelpToAgreeOnChildArrangementsOption(page, 'Someone else to guide our conversations')
    await selectOtherOptions(page, 'No, we have not tried yet')
    await expect(page).toHaveURL(/mediation/i);

    await clickExitButton(page);
    await assertNavigationToBBCWeather(page, /mediation/)
  });
});