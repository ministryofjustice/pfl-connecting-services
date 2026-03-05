import { Page } from '@playwright/test';

export async function startJourney(page: Page) {
  // Start from homepage - with USE_AUTH=false this goes directly to safety-check
  await page.goto('/');
  await page.getByRole('button', { name: /start now/i }).click();
}

export async function selectDomesticAbuseOption(page: Page, choiceLabel: 'Yes' | 'No') {
  await page.getByLabel(choiceLabel).check();
  await page.getByRole('button', { name: /continue/i }).click();
}

export async function selectContactChildArrangementsOption(page: Page, choiceLabel: 'Yes' | 'No, I am not comfortable contacting them' | 'No, I do not have their contact details' | 'I can contact them but they do not respond') {
  await page.getByLabel(choiceLabel).check();
  await page.getByRole('button', { name: /continue/i }).click();
}

export async function selectAgreeOnChildArrangmentsOption(page: Page, choiceLabel: 'Yes, we agree on some or most things' | 'No, we do not agree' | 'We have not discussed it yet') {
  await page.getByLabel(choiceLabel).check();
  await page.getByRole('button', { name: /continue/i }).click();
}

export async function completeSafetyChecks(page: Page) {
  await page.getByLabel(/yes/i).first().check();
  await page.getByRole('button', { name: /continue/i }).click();

  await page.getByLabel(/yes/i).first().check();
  await page.getByRole('button', { name: /continue/i }).click();
}

export async function completeOnboardingFlow(page: Page) {
  await startJourney(page);
  await completeSafetyChecks(page);

  // do-whats-best page - check the required checkbox (note: uses fancy apostrophe)
  await page.getByRole('checkbox', { name: /I will put my children.s needs first/i }).check();
  await page.getByRole('button', { name: /continue/i }).click();

  // court-order-check
  await page.getByLabel(/no/i).first().check();
  await page.getByRole('button', { name: /continue/i }).click();
}

export async function fillNumberOfChildren(page: Page, count: number) {
  // The number-of-children page uses a text input, not radio buttons
  await page.getByLabel(/How many children is this for/i).fill(count.toString());
  await page.getByRole('button', { name: /continue/i }).click();
}

export async function fillChildDetails(
  page: Page,
  firstName: string,
  childIndex: number = 0,
) {
  // The about-the-children page only collects first names
  // Field name is 'child-name0', 'child-name1', etc.
  const fieldName = `child-name${childIndex}`;
  await page.fill(`input[name="${fieldName}"]`, firstName);
}

export async function fillAllChildrenAndContinue(
  page: Page,
  childNames: string[],
) {
  // Fill all children's first names, then click continue once
  for (let i = 0; i < childNames.length; i++) {
    await fillChildDetails(page, childNames[i], i);
  }
  await page.getByRole('button', { name: /continue/i }).click();
}

export async function fillAdultDetails(
  page: Page,
  adult1FirstName: string,
  adult2FirstName: string,
) {
  // The about-the-adults page only collects first names
  await page.fill('input[name="initial-adult-name"]', adult1FirstName);
  await page.fill('input[name="secondary-adult-name"]', adult2FirstName);
  await page.getByRole('button', { name: /continue/i }).click();
}

export async function navigateToTaskList(page: Page) {
  await completeOnboardingFlow(page);
  await fillNumberOfChildren(page, 1);
  await fillAllChildrenAndContinue(page, ['Test']);
  await fillAdultDetails(page, 'Parent', 'Guardian');
}

export async function acceptCookies(page: Page) {
  const cookieBanner = page.locator('.govuk-cookie-banner');
  const count = await cookieBanner.count();
  if (count > 0 && (await cookieBanner.isVisible())) {
    const acceptButton = cookieBanner.getByRole('button', { name: /accept/i });
    if ((await acceptButton.count()) > 0) {
      await acceptButton.click();
    }
  }
}

export function generateTestChildData(index: number) {
  const firstNames = ['Emma', 'Oliver', 'Sophia', 'James', 'Isabella'];

  return {
    firstName: firstNames[index % firstNames.length],
  };
}
