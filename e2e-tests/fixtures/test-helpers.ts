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

export async function selectContactChildArrangementsOption(page: Page, choiceLabel: 'Yes' | 'No, I am not comfortable contacting them' | 'I do not have their contact details' | 'I can contact them but they do not respond') {
  await page.getByLabel(choiceLabel).check();
  await page.getByRole('button', { name: /continue/i }).click();
}

export async function selectAgreeOnChildArrangementsOption(page: Page, choiceLabel: 'Yes, we agree on some or most things' | 'No, we do not agree' | 'We have not discussed it yet') {
  await page.getByLabel(choiceLabel).check();
  await page.getByRole('button', { name: /continue/i }).click();
}

export async function selectHelpToAgreeOnChildArrangementsOption(page: Page, choiceLabel: 'A plan we can follow ourselves' | 'Someone else to guide our conversations' | 'We cannot agree – someone else needs to make a decision for us') {
  await page.getByLabel(choiceLabel).check();
  await page.getByRole('button', { name: /continue/i }).click();
}

export async function selectOtherOptions(page: Page, choiceLabel: 'Yes, we have tried one or more of these' | 'No, we have not tried any of these') {
  await page.getByLabel(choiceLabel).check();
  await page.getByRole('button', { name: /continue/i }).click();
}