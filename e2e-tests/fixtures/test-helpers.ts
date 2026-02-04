import { Page } from '@playwright/test';

/**
 * Start the journey from the homepage
 */
export async function startJourney(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: /start now/i }).click();
}

/**
 * Complete the domestic abuse question with 'No' answer
 * Navigates to contact-comfort page
 */
export async function completeDomesticAbuse(page: Page, answer: 'yes' | 'no' = 'no') {
  await page.locator(`input[type="radio"][value="${answer}"]`).check();
  await page.getByRole('button', { name: /continue/i }).click();
}

/**
 * Complete the contact comfort question
 * Options: 'yes', 'no', 'no-details', 'not-response'
 */
export async function completeContactComfort(page: Page, answer: 'yes' | 'no' | 'no-details' | 'not-response' = 'yes') {
  await page.locator(`input[type="radio"][value="${answer}"]`).check();
  await page.getByRole('button', { name: /continue/i }).click();
}

/**
 * Complete the agreement question
 * Options: 'yes', 'no', 'not-discussed'
 */
export async function completeAgreement(page: Page, answer: 'yes' | 'no' | 'not-discussed' = 'no') {
  await page.locator(`input[type="radio"][value="${answer}"]`).check();
  await page.getByRole('button', { name: /continue/i }).click();
}

/**
 * Complete the help options question
 * Options: 'plan', 'help', 'cannot'
 */
export async function completeHelpOptions(page: Page, answer: 'plan' | 'help' | 'cannot' = 'help') {
  await page.locator(`input[type="radio"][value="${answer}"]`).check();
  await page.getByRole('button', { name: /continue/i }).click();
}

/**
 * Complete the mediation check question
 * Options: 'yes', 'no'
 */
export async function completeMediationCheck(page: Page, answer: 'yes' | 'no' = 'no') {
  await page.locator(`input[type="radio"][value="${answer}"]`).check();
  await page.getByRole('button', { name: /continue/i }).click();
}

/**
 * Navigate from start to domestic abuse page
 */
export async function navigateToDomesticAbuse(page: Page) {
  await startJourney(page);
}

/**
 * Navigate from start to contact comfort page
 */
export async function navigateToContactComfort(page: Page) {
  await startJourney(page);
  await completeDomesticAbuse(page, 'no');
}

/**
 * Navigate from start to agreement page
 */
export async function navigateToAgreement(page: Page) {
  await navigateToContactComfort(page);
  await completeContactComfort(page, 'yes');
}

/**
 * Navigate from start to help options page
 */
export async function navigateToHelpOptions(page: Page) {
  await navigateToAgreement(page);
  await completeAgreement(page, 'no');
}

/**
 * Navigate from start to mediation check page
 */
export async function navigateToMediationCheck(page: Page) {
  await navigateToHelpOptions(page);
  await completeHelpOptions(page, 'help');
}

/**
 * Navigate from start to options-no-contact page
 */
export async function navigateToOptionsNoContact(page: Page) {
  await navigateToContactComfort(page);
  await completeContactComfort(page, 'no');
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
